import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ModalHelper, _HttpClient, SettingsService } from '@delon/theme';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { STComponent, STColumn, STChange, STColumnBadge, STPage } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { ReceiveEditComponent } from './receive-edit.component';
import { Recoverable } from 'repl';

@Component({
  selector: 'app-supply-receive',
  templateUrl: './receive.component.html',
})
export class ReceiveComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    public settings: SettingsService,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
  params: any = {};
  // record: any;
  page: any = {
    records: [],
    current: 1,
    total: 0,
    size: 10,
  };
  pagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true,
  };
  // searchSchema: SFSchema = {
  //   properties: {
  //     name: {
  //       type: 'string',
  //       title: '名称'
  //     },
  //   },
  // };
  DELIVER_STATUS: STColumnBadge = {
    0: {text: '创建', color: 'default'},
    5: {text: '待审批', color: 'processing'},
    10: {text: '待发货', color: 'processing'},
    15: {text: '发货中', color: 'processing'},
    20: {text: '已签收', color: 'success'},
    30: {text: '完成', color: 'success'},
    88: {text: '入库', color: 'success'},
    99: {text: '退货', color: 'error'}
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '发货单号', index: 'deliverNo'},
    { title: '发货时间', index: 'deliverTime', type: 'date' },
    { title: '采购商', index: 'providerName'},
    { title: '状态', index: 'status' , type: 'badge', badge: this.DELIVER_STATUS},
    {
      title: '操作',
      buttons: [
        {
          text: '物料明细',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: ReceiveEditComponent,
            size: 'xl'
          },
          click: () => {
            this.query(null);
          },
        },
        {
          text: '一键签收',
          icon: 'edit',
          iif: record => record.status === 15,
          click: (record) => {
            this.receive(record);
          },
        },
        {
          text: '一键入库',
          icon: 'edit',
          iif: record => record.status === 20,
          click: (record) => {
            this.check(record, 0);
          },
        },
        {
          text: '一键退货',
          icon: 'edit',
          iif: record => record.status === 20,
          click: (record) => {
            this.check(record, 1);
          },
        }
      ],
    },
  ];

  ngOnInit() {
    this.query(null);
  }

  ngOnDestroy(): void {
    super.clearAbilities();
  }

  query(event: any) {
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    if (event) {
      if (event.name) this.params.name = event.name;
    }
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
    if (!firmInfo) {
      return;
    }
    this.params.firmId = firmInfo.id;
    this.http
    .get(Api.BaseSupplyDeliverUrl + 'page/' + current + '/' + size + '/1', this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  change(e: STChange) {
    console.log('change', e);
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.size = e.ps;
      this.params.current = e.pi;
      this.query(null);
    }
  }
// 签收
  receive(record: any) {
    console.log(record);
    this.modalService.confirm({
      nzTitle: '确定签收吗?',
      nzContent:
        '<b style="color: red;">如果您确定要签收请点击确定按钮，否则点取消</b>',
      nzOkText: '签收',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .put(Api.BaseSupplyDeliverUrl + 'receive', null, {deliverId: record.id})
          .subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.st.reload();
                this.msg.success('签收成功');
              } else {
                this.msg.warning(res.message);
              }
            } else {
              this.msg.error('签收失败，未知错误');
            }
          }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
// 验收 0 签收 1 退货
  check(record: any, result: number) {
    console.log(record);
    const title = result === 1 ? '确定退货吗?' : '确定入库吗?';
    const content = result === 1 ? '<b style="color: red;">如果您确定要退货请点击确定按钮，否则点取消</b>' : '<b style="color: red;">如果您确定要入库请点击确定按钮，否则点取消</b>';
    const okText = result === 1 ? '退货' : '入库';
    const params: any =  {};
    params.deliverId = record.id;
    params.result = result;
    this.modalService.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: okText,
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .put(Api.BaseSupplyDeliverUrl + 'check', null, params)
          .subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.st.reload();
                this.msg.success(result === 1 ? '退货成功' : '入库成功');
              } else {
                this.msg.warning(res.message);
              }
            } else {
              this.msg.error(result === 1 ? '退货失败，未知错误' : '入库失败，未知错误');
            }
          }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
