import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FirmEditComponent } from './firm-edit.component';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';

@Component({
  selector: 'app-supply-firm-list',
  templateUrl: './firm-list.component.html',
})
export class FirmListComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
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
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      unicode: {
        type: 'string',
        title: '社会统一信用代码',
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '简称', index: 'shortName' },
    { title: '社会统一信用代码', index: 'unicode' },
    { title: '电话', index: 'phone' },
    { title: '地址', index: 'address' },
    { title: '银行账号', index: 'bankAccount' },
    { title: '开户行', index: 'bankName' },
    { title: '联系人', index: 'contacts' },
    { title: '描述', width: '150px', index: 'description' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑员工',
          icon: 'edit',
          acl: { ability: ['edit'] },
        },
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: FirmEditComponent,
          },
          click: () => {
            this.query(null);
          },
          acl: { ability: ['edit'] },
        },
        {
          text: '删除',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
          acl: { ability: ['delete'] },
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
    this.params = {};
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.description) this.params.description = event.description;
    }
    this.http
      .get(Api.BaseSupplyFirmApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(FirmEditComponent)
      .subscribe(() => this.st.reload());
  }

  delete(record: any) {
    console.log(record);
    this.modalService.confirm({
      nzTitle: '确定删除吗?',
      nzContent:
        '<b style="color: red;">如果您确定要删除请点击确定按钮，否则点取消</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .delete(Api.BaseSupplyFirmApi + record.id)
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
