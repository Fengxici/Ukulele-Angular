import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFDateWidgetSchema, SFNumberWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { STComponent, STColumn, STColumnBadge } from '@delon/abc';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-supply-market-edit',
  templateUrl: './market-edit.component.html',
})
export class MarketEditComponent implements OnInit {
  orderId: string;
  consumerId: string;
  orderInfo: any = {};
  orderDetail: any[] = [];
  consumerInfo: any = {};
  tmpMaterialRecord: any = {};
  materialModalVisibility = false;
  changeDeliverDateModalVisibility = false;
  currentStep = 1;
  basicNum = 0;
  amountNum = 0;
  ORDER_DETAIL_STATUS: STColumnBadge = {
    0: {text: '创建', color: 'default'},
    10: {text: '提交', color: 'processing'},
    20: {text: '供应商确认', color: 'processing'},
    25: {text: '采购商确认', color: 'processing'},
    30: {text: '安排中', color: 'processing'},
    40: {text: '完成生产', color: 'processing'},
    50: {text: '发货中', color: 'processing'},
    60: {text: '签收', color: 'processing'},
    70: {text: '入库', color: 'processing'},
    80: {text: '退货', color: 'error'},
  };
  CHANGE_STATUS: STColumnBadge = {
    0: {text: '未变更', color: 'default'},
    1: {text: '处理中', color: 'processing'},
    2: {text: '已处理', color: 'success'},
  };
  @ViewChild('st', { static: true }) st: STComponent;
  detailColumns: STColumn[] = [
    {title: '编号', type: 'no'},
    { title: '物料编号', index: 'materialNo'},
    { title: '物料名称', index: 'name' },
    { title: '规格', index: 'format' },
    { title: '单位', index: 'unit' },
    { title: '单价', index: 'price', type: 'currency' },
    { title: '数量', index: 'number', className: 'text-right' },
    { title: '金额', index: 'subtotal', type: 'currency' },
    { title: '期望交货时间', index: 'expectDeliverTime', type: 'date' , dateFormat: 'YYYY-MM-DD'},
    { title: '预计交货时间', index: 'estimateDeliverTime', type: 'date', dateFormat: 'YYYY-MM-DD' },
    { title: '状态', index: 'status' , type: 'badge', badge: this.ORDER_DETAIL_STATUS},
    { title: '变更状态', index: 'changeStatus', type: 'badge', badge: this.CHANGE_STATUS },
    {
      title: '操作',
      buttons: [
        {
          text: '修改',
          icon: 'edit',
          iif: record => record.status === 10,
          click: (record) => {
            this.editMaterialInfo(record);
          }
        },
        {
          text: '变更交期',
          icon: 'edit',
          iif: record => record.status >= 25 && record.status <= 40,
          click: (record) => {
            this.openChangeDelverDateModal(record);
          }
        },
        {
          text: '完成',
          icon: 'edit',
          iif: record => record.status === 30,
          pop: {
            title: '确定该物料完成了吗?',
            okType: 'default',
            icon: 'star',
          },
          click: (record) => {
            this.completeMaterial(record);
          }
        },
        {
          text: '加入发货仓',
          icon: 'edit',
          iif: record => record.status === 40,
          pop: {
            title: '确定该物料加入发货单吗?',
            okType: 'default',
            icon: 'star',
          },
          click: (record) => {
            this.deliverMaterial(record);
          }
        }
      ],
    },
  ];
  materialSchema: SFSchema = {
    properties: {
      materialNo: { type: 'string', title: '物料编号', maxLength: 15, readOnly: true },
      name: { type: 'string', title: '物料名称', readOnly: true },
      format: { type: 'string', title: '规格', readOnly: true },
      unit: { type: 'string', title: '单位', readOnly: true },
      number: { type: 'number', title: '数量', readOnly: true },
      expectDeliverTime: { type: 'string', ui: { widget: 'date', format: 'YYYY-MM-DD 00:00:0' } as SFDateWidgetSchema,
                          title: '期望交货时间',  readOnly: true},
      price: { type: 'number', title: '单价', ui: { prefix: '￥' } as SFNumberWidgetSchema, readOnly: true },
      estimateDeliverTime: { type: 'string', ui: { widget: 'date', format: 'YYYY-MM-DD 00:00:00' } as SFDateWidgetSchema,
                          title: '预计交货时间'  },
    },
    required: [ 'estimateDeliverTime'],
  };
  materialUi: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };
  constructor(public msg: NzMessageService, private http: _HttpClient,
              private route: Router, private router: ActivatedRoute, private cdr: ChangeDetectorRef) {
    const that = this;
    this.router.queryParams.subscribe((res) => {
      if (!res) {
        this.msg.error('参数有误');
        return;
      }
      that.orderId = res.orderId;
      that.consumerId = res.consumerId;
    });
  }

  ngOnInit() {
    if (this.orderId && this.orderId !== '0') {
      this.queryOrderInfo();
      this.queryOrderDetail();
    }
    if (this.consumerId && this.consumerId !== '0') {
      this.querySupplyFirmInfo();
    }
  }

  queryOrderInfo() {
    this.http
    .get(Api.BaseSupplyMarketApi + this.orderId)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.orderInfo = res.data;
          this.stepTo();
        }
      }
    });
  }

  stepTo() {
    if (this.orderInfo.status === 20) {
      this.currentStep = 0;
    } else if (this.orderInfo.status === 40) {
      this.currentStep = 1;
    } else if (this.orderInfo.status === 50) {
      this.currentStep = 2;
    } else if (this.orderInfo.status === 60) {
      this.currentStep = 3;
    } else if (this.orderInfo.status === 80) {
      this.currentStep = 4;
    } else if (this.orderInfo.status === 90) {
      this.currentStep = 5;
    }  else {
      this.currentStep = 0;
    }
  }

  queryOrderDetail() {
    this.http
    .get(Api.BaseSupplyMarketApi + 'detail/' + this.orderId)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) this.orderDetail = res.data;
        this.calculatDetail();
      }
    });
  }

  calculatDetail() {
    if (this.orderDetail) {
      this.basicNum = 0;
      this.amountNum = 0.00;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.orderDetail.length; i++) {
        this.basicNum += this.orderDetail[i].number;
        this.orderDetail[i].subtotal = this.orderDetail[i].number * this.orderDetail[i].price;
        this.amountNum += this.orderDetail[i].subtotal;
      }
    }
  }

  querySupplyFirmInfo() {
    this.http
    .get(Api.BaseSupplyFirmApi + this.consumerId)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) this.consumerInfo = res.data;
      }
    });
  }

  backList(event: any) {
    this.route.navigate(['/supply/market']);
  }

  editMaterialInfo(record: any) {
    this.materialModalVisibility = true;
    this.tmpMaterialRecord = record;
  }
  handleMaterialInfoModalClose(value: any): void {
    if (!value) {
      this.materialModalVisibility = false;
      return;
    }
    if (value.id && value.estimateDeliverTime) {
      this.http
      .put(Api.BaseSupplyOrderFlowApi + '/material/delivery/set', value)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          for (let i = 0; i < this.orderDetail.length; i++) {
            if (value.id === this.orderDetail[i].id) {
              this.orderDetail[i] = value;
              break;
            }
          }
          this.calculatDetail();
          this.st.reload();
          this.materialModalVisibility = false;
        } else {
          this.msg.error(res ? res.message : '未知错误');
        }
      });
    } else {
      this.msg.warning('请填写预计交期');
    }
  }
  handleDeleteMaterialInfo(record: any) {
    for (let i = 0; i < this.orderDetail.length; i++) {
      if (record.materialNo === this.orderDetail[i].materialNo) {
        this.orderDetail.splice(i, 1);
        break;
      }
    }
    this.calculatDetail();
    this.st.reload();
  }

  verifyOrder() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.orderDetail.length; i++) {
      if (!this.orderDetail[i].estimateDeliverTime) {
        this.msg.warning('请先填写完所有物料的预计交期！');
        return;
      }
    }
    this.http
    .put(Api.BaseSupplyOrderFlowApi + '/market/verify/' + this.orderId )
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
          this.queryOrderInfo();
          this.queryOrderDetail();
          this.materialModalVisibility = false;
      } else {
        this.msg.error(res ? res.message : '未知错误');
      }
    });
  }

  markingOrder() {
    this.http
    .put(Api.BaseSupplyOrderFlowApi + '/market/making/' + this.orderId )
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
          this.queryOrderInfo();
          this.queryOrderDetail();
          this.materialModalVisibility = false;
      } else {
        this.msg.error(res ? res.message : '未知错误');
      }
    });
  }

  completeMaterial(record: any) {
    this.http
    .put(Api.BaseSupplyOrderFlowApi + '/market/material/complete/' + record.id )
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
          this.queryOrderDetail();
          this.msg.success(res.message);
      } else {
        this.msg.error(res ? res.message : '未知错误');
      }
    });
  }

  deliverMaterial(record: any) {
    this.http
    .put(Api.BaseSupplyOrderFlowApi + '/market/material/deliver/' + record.id )
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
          this.queryOrderDetail();
          this.msg.success(res.message);
      } else {
        this.msg.error(res ? res.message : '未知错误');
      }
    });
  }

  openChangeDelverDateModal(record: any) {
    this.changeDeliverDateModalVisibility = true;
    this.tmpMaterialRecord = record;
  }

  deliverDateChange(record: any) {
    if (record && record.estimateDeliverTime) {
      this.http
      .put(Api.BaseSupplyOrderFlowApi + '/material/delivery/change', record)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
            this.st.reload();
            this.msg.success(res.message);
        } else {
          this.msg.error(res ? res.message : '未知错误');
        }
      });
    }
    this.changeDeliverDateModalVisibility = false;
  }
  deliverDateSet(record: any) {
    if (record && record.estimateDeliverTime) {
      this.http
      .put(Api.BaseSupplyOrderFlowApi + '/material/delivery/set', record)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
            this.st.reload();
            this.msg.success(res.message);
        } else {
          this.msg.error(res ? res.message : '未知错误');
        }
      });
    }
    this.changeDeliverDateModalVisibility = false;
  }
}
