import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange, STColumnBadge } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { Observable } from 'rxjs';
import { PublicService } from '@shared/service/public.service';
import { catchError, map } from 'rxjs/operators';
import { FirmDrawerComponent } from '../common/firm-drawer.component';

@Component({
  selector: 'app-supply-market',
  templateUrl: './market.component.html',
})
export class MarketComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    private http: _HttpClient,
    public settings: SettingsService,
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
  pagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true,
  };
  PURCHASE_ORDER_STATUS: STColumnBadge = {
    0: {text: '创建', color: 'default'},
    20: {text: '提交', color: 'success'},
    40: {text: '供应商确认', color: 'success'},
    50: {text: '订单确认', color: 'success'},
    60: {text: '安排中', color: 'success'},
    80: {text: '发货中', color: 'success'},
    90: {text: '完成', color: 'success'},
  };
  CHANGE_STATUS: STColumnBadge = {
    0: {text: '未变更', color: 'default'},
    1: {text: '处理中', color: 'processing'},
    2: {text: '已处理', color: 'success'},
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
          asyncData: () => this.queryDicItem('MARKET_ORDER_STATUS') ,
          width: 150,
        } ,
      },
      provider: {
        type: 'string',
        title: '采购商',
        default: '-1',
        ui: {
          widget: 'select',
          asyncData: () => this.queryConsumerList() ,
          width: 260,
        } ,
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('drawer', {static: true }) firmDraw: FirmDrawerComponent;
  columns: STColumn[] = [
    { title: '', width: '50', render: 'id'},
    { title: '订单编号', index: 'orderNo', },
    { title: '状态', index: 'status' , type: 'badge', badge: this.PURCHASE_ORDER_STATUS},
    { title: '采购商', index: 'consumerName' },
    { title: '订单金额', index: 'orderSum', type: 'currency' },
    { title: '下单日期', index: 'createTime', type: 'date' , dateFormat: 'YYYY-MM-DD' },
    { title: '变更状态', index: 'changeStatus', type: 'badge', badge: this.CHANGE_STATUS },
    {
      title: '操作',
      buttons: [
        {
          text: '详情',
          icon: 'edit',
          click: (record: any) => {
            this.toDetail(record);
          },
        },
        {
          text: '删除',
          icon: 'delete',
          iif: record => record.status === 0,
          click: (record: any) => {
            this.delete(record);
          },
        },
      ],
    },
  ];

  ngOnInit() {
    super.initAbilities();
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
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
    if (!firmInfo) {
      return;
    }
    this.params = {firmId: firmInfo.id};
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.description) this.params.description = event.description;
    }
    this.http
      .get(Api.BaseSupplyMarketApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  toDetail(record: any) {
    this.router.navigate(['/supply/marketDetail'],
    {queryParams: {orderId: record ? record.id : '0', consumerId: record ? record.consumer : '0'}});
  }
  queryConsumerList() {
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
    const params = {firmId: firmInfo.id};
    const providerObservalbe =  this.http
    .get(Api.BaseSupplyConsumerApi + '/list', params).pipe(
      catchError(() => {
        return [{ label: '所有', value: '-1' }];
      }),
      map(res => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            const data = [{ label: '所有', value: '-1' }];
            res.data.forEach(element => {
              const item = {value: element.supplierId, label: element.name};
              data.push(item);
            });
            return data;
          }
        }
        return [{ label: '所有', value: '-1' }];
      })
    );
    return providerObservalbe;
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
          .delete(Api.BaseSupplyMarketApi + record.id)
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
