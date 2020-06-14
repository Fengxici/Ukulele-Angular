import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { ConsumerEditComponent } from './consumer-edit.component';
import { FirmDrawerComponent } from '../common/firm-drawer.component';
import { FirmUserModalComponent } from '../common/user-modal.component';

@Component({
  selector: 'app-supply-consumer',
  templateUrl: './consumer.component.html',
})
export class ConsumerComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService,
  ) {
    super(route, ability);
  }
  params: any = {};
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
      // userId: {
      //   type: 'string',
      //   title: '编号',
      //   ui: {
      //     acl: { ability: ['query'] },
      //   },
      // }
  //   },
  // };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('drawer', {static: true }) firmDraw: FirmDrawerComponent;
  columns: STColumn[] = [
    { title: '名称', index: 'name', width: 200 },
    { title: '简称', index: 'shortName', width: 100 },
    { title: '社会统一信用代码', index: 'unicode', width: 100 },
    { title: '电话', index: 'phone', width: 100 },
    { title: '地址', index: 'address', width: 250 },
    { title: '联系人', index: 'contacts', width: 80 },
    { title: '描述',  index: 'description', width: 200 },
    {
      title: '操作',
      buttons: [
        {
          text: '删除',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
          acl: { ability: ['delete'] },
        },
        {
          text: '分配',
          icon: 'edit',
          click: (record: any) => {
            this.dispatch(record);
          },
        },
      ],
    },
  ];

  ngOnInit() {
    super.initAbilities();
    this.query(null);
  }

  ngOnDestroy(): void {
    super.clearAbilities();
  }

  change(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.size = e.ps;
      this.params.current = e.pi;
      this.query(null);
    }
  }
  query(event: any) {
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    this.params = {firmId: firmInfo.id};
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.description) this.params.description = event.description;
    }
    this.http
      .get(Api.BaseSupplyConsumerApi + '/page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(ConsumerEditComponent)
      .subscribe(() => this.st.reload());
  }
  dispatch(record) {
    const userModal = this.modalService.create({
      nzTitle: '客户分配',
      nzContent: FirmUserModalComponent,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        inputData: record,
      },
      nzWidth: 950,
      nzFooter: null
    });
    userModal.afterClose.subscribe((result: any) => this.dispatchUser(result));
  }

  // 分配供应商
  dispatchUser(record) {
    if (record) {
      const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
      const params = {
        userId: record.user.userId,
        firm: firmInfo.id,
        consumer: record.ext.consumerId,
        type: 0
      };
      this.http.post(Api.BaseSupplyMyConsumerUrl, params).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msg.success('分配成功');
          } else {
            this.msg.warning(res.message);
          }
        } else {
          this.msg.error('分配失败，未知错误');
        }
      });
    }
  }
  
  delete(record: any) {
    console.log(record);
    const params = {consumerId: record.consumerId, firmId: record.firmId};
    this.modalService.confirm({
      nzTitle: '确定删除吗?',
      nzContent:
        '<b style="color: red;">如果您确定要删除请点击确定按钮，否则点取消</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .delete(Api.BaseSupplyConsumerApi, params)
          .subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.st.reload();
                this.msg.success('删除成功');
              } else {
                this.msg.warning(res.message);
              }
            } else {
              this.msg.error('删除失败，未知错误');
            }
          }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
