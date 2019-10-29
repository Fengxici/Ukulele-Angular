import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PurchaseEditComponent } from './purchase-edit.component';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { PublicService } from '@shared/service/public.service';

@Component({
  selector: 'app-supply-purchase',
  templateUrl: './purchase.component.html',
})
export class PurchaseComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    private pubService: PublicService,
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
      orderNo: {
        type: 'string',
        title: '订单编号',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      status: {
        type: 'string',
        title: '状态',
        enum: [
          { label: '所有', value: '-1' }
        ],
        ui: {
          widget: 'select',
          width: 120,
          acl: { ability: ['query'] },
        },
      },
      financeStatus: {
        type: 'string',
        title: '财务状态',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      settleType: {
        type: 'string',
        title: '结算方式',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      provider: {
        type: 'string',
        title: '供应方',
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '订单编号', index: 'orderNo' },
    { title: '状态', width: '150px', index: 'status' },
    { title: '财务状态', index: 'financeStatus' },
    { title: '结算方式', index: 'settleType' },
    { title: '供应方', index: 'provider' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: PurchaseEditComponent,
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
    this.queryDicItem('PURCHASE_ORDER_STATUS');
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

  queryDicItem(key: string) {
    this.pubService.queryDicByIndex(key).subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.searchSchema.properties.status.enum = [];
          this.searchSchema.properties.status.enum.push({ label: '所有', value: '-1' });
          res.data.array.forEach(element => {
            this.searchSchema.properties.status.enum.push({label: element.label, value: element.value });
          });
        }
      }
    });
  }
  query(event: any) {
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    this.params = {firmId: 1};
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.description) this.params.description = event.description;
    }
    this.http
      .get(Api.BaseSupplyPurchaseApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(PurchaseEditComponent)
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
          .delete(Api.BaseSupplyPurchaseApi + record.id)
          .subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.st.reload();
                this.msg.success('删除成功');
              } else {
                this.msg.warning(res.msg);
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
