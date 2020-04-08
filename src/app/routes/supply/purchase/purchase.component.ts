import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange, STColumnBadge } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { PublicService } from '@shared/service/public.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FirmDrawerComponent } from '../common/firm-drawer.component';

@Component({
  selector: 'app-supply-purchase',
  templateUrl: './purchase.component.html',
})
export class PurchaseComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private modalService: NzModalService,
    private msg: NzMessageService,
    private pubService: PublicService,
    private router: Router,
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
  PURCHASE_ORDER_STATUS: STColumnBadge = {
    0: {text: '创建', color: 'default'},
    20: {text: '提交', color: 'success'},
    40: {text: '确认', color: 'success'},
    60: {text: '生产中', color: 'success'},
    80: {text: '发货中', color: 'success'},
    90: {text: '完成', color: 'success'},
  };
  FINANCE_STATUS: STColumnBadge = {
    1: {text: '待付款', color: 'warning'},
    2: {text: '待开票', color: 'success'},
    3: {text: '已付款', color: 'success'},
    4: {text: '已开票', color: 'success'},
  };
  SETTLE_TYPE: STColumnBadge = {
    1: {text: '预付款', color: 'warning'},
    2: {text: '月结', color: 'success'},
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
      },
      status: {
        type: 'string',
        title: '状态',
        default: '-1',
        ui: {
          widget: 'select',
          asyncData: () => this.queryDicItem('PURCHASE_ORDER_STATUS') ,
          width: 150,
        } ,
      },
      financeStatus: {
        type: 'string',
        title: '财务状态',
        default: '-1',
        ui: {
          widget: 'select',
          asyncData: () => this.queryDicItem('FINANCE_STATUS') ,
          width: 180,
        } ,
      },
      settleType: {
        type: 'string',
        title: '结算方式',
        default: '-1',
        ui: {
          widget: 'select',
          asyncData: () => this.queryDicItem('SETTLE_TYPE') ,
          width: 160,
        } ,
      },
      provider: {
        type: 'string',
        title: '供应商',
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('drawer', {static: true }) firmDraw: FirmDrawerComponent;
  columns: STColumn[] = [
    { title: '订单编号', index: 'orderNo' },
    { title: '状态', index: 'status' , type: 'badge', badge: this.PURCHASE_ORDER_STATUS},
    { title: '财务状态', index: 'financeStatus', type: 'badge', badge: this.FINANCE_STATUS },
    { title: '结算方式', index: 'settleType', type: 'badge', badge: this.SETTLE_TYPE },
    { title: '供应商', index: 'provider' },
    {
      title: '操作',
      buttons: [
        {
          text: '详情',
          icon: 'edit',
          click: (record: any) => {
            this.toDetail(record);
          },
          acl: { ability: ['edit'] },
        },
        {
          text: '提交',
          icon: 'check',
          click: (record: any) => {
            this.commitPurchaseOrder(record);
          },
          iif: record => record.status === 0,
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

  queryDicItem(key: string): Observable<any> {
    const dicItemObservable = this.pubService.queryDicByIndex(key).pipe(
      catchError(() => {
        return [{ label: '所有', value: '-1' }];
      }),
      map(res => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            const data = [{ label: '所有', value: '-1' }];
            return data.concat(res.data);
          }
        }
        return [{ label: '所有', value: '-1' }];
      })
    );
    return dicItemObservable;
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
      .get(Api.BaseSupplyPurchaseApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  toDetail(record: any) {
    this.router.navigate(['/supply/purchaseAdd'],
      {queryParams: {orderId: record ? record.id : '0', providerId: record ? record.provider : '0'}});
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

  commitPurchaseOrder(record) {
    this.http.post(Api.BaseSupplyOrderFlowApi + '/purchase/commit/' + record.id).subscribe((res: any) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          record.status = 5;
          this.msg.success('提交成功');
        } else {
          this.msg.warning(res.message);
        }
      } else {
        this.msg.error('提交失败，未知错误');
      }
    });
  }
}
