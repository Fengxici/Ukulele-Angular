import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STColumn, STPage, STComponent, STChange, STColumnBadge } from '@delon/abc';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { SFSchema, SFStringWidgetSchema, SFUISchema, SFDateWidgetSchema, SFTextareaWidgetSchema, SFNumberWidgetSchema } from '@delon/form';

@Component({
  selector: 'app-supply-purchase-edit',
  templateUrl: './purchase-edit.component.html',
  styleUrls: ['./purchase-edit.component.less']
})
export class PurchaseEditComponent implements OnInit {
  orderId: string;
  providerId: string;
  orderInfo: any = {};
  orderDetail: any[] = [];
  providerInfo: any = {};
  providerPage: any = {
    records: [],
    current: 1,
    total: 0,
    size: 10,
  };
  providerPagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true,
  };
  providerParams: any = {};
  tmpMaterialRecord: any = {};
  materialSearchParams: any = {};
  materialSearchPagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true,
  };
  materialSearchPage: any = {
    records: [],
    current: 1,
    total: 0,
    size: 10,
  };
  orderInfoModalVisibility = false;
  providerModalVisibility = false;
  materialModalVisibility = false;
  addFlag = {
    first: true
  };
  currentStep = 1;
  basicNum = 0;
  amountNum = 0;
  ORDER_DETAIL_STATUS: STColumnBadge = {
    0: {text: '创建', color: 'default'},
    10: {text: '提交', color: 'processing'},
    20: {text: '供应商确认', color: 'processing'},
    25: {text: '采购商确认', color: 'processing'},
    30: {text: '生产中', color: 'processing'},
    40: {text: '完成生产', color: 'processing'},
    50: {text: '发货中', color: 'processing'},
    60: {text: '签收', color: 'processing'},
    70: {text: '验收', color: 'processing'},
    80: {text: '退货', color: 'error'},
  };
  @ViewChild('orderDetailSt', { static: true }) orderDetailSt: STComponent;
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
    {
      title: '操作',
      buttons: [
        {
          text: '修改',
          icon: 'edit',
          click: (record) => {
            this.editMaterialInfo(record);
          },
          iif: record => record.status < 10
        },
        {
          text: '删除',
          icon: 'delete',
          iif: (record) => record.status < 10,
          pop: {
            title: '确定要删除吗?',
            okType: 'danger',
            icon: 'star',
          },
          click: (record) => {
            this.handleDeleteMaterialInfo(record);
          }
        },
      ],
    },
  ];
  orderInfoSchema: SFSchema = {
    properties: {
      orderNo: {type: 'string', title: '订单编号', maxLength: 15, ui: {placeholder: '自动生成'} as SFStringWidgetSchema, readOnly: true},
      needInvoice: { type: 'boolean', title: '是否开票' },
      receiveInfo: { type: 'string', title: '收货信息' },
      remark: { type: 'string', title: '备注', ui: {
        widget: 'textarea',
        autosize: { minRows: 2, maxRows: 6 },
      } as SFTextareaWidgetSchema, }
    },
  };
  orderInfoUi: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };
  providerSearchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '供应商名称'
      }
    },
  };

  @ViewChild('providerst', { static: true }) providerst: STComponent;
  providerColumns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '简称', index: 'shortName' },
    { title: '社会统一信用代码', index: 'unicode' },
    {
      title: '操作',
      buttons: [
        {
          text: '选择',
          icon: 'check',
          click: (record: any) => {
            this.handleProviderInfoModalClose(record);
          }
        },
      ],
    },
  ];
  materialSearchSchema: SFSchema = {
    properties: {
      materialNo: {
        type: 'string',
        title: '物料编号',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      name: {
        type: 'string',
        title: '名称',
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('materialSearchSt', { static: true }) materialSearchSt: STComponent;
  materialSearchColumns: STColumn[] = [
    { title: '物料编号', index: 'materialNo' },
    { title: '物料名称',  index: 'name' },
    { title: '规格', index: 'format'  },
    { title: '单位', index: 'unit'  },
    { title: '含税单价', index: 'price', type: 'currency' },
    {
      title: '操作',
      buttons: [
        {
          text: '选择',
          icon: 'plus',
          click: (record) => {
            this.setTmpMaterialRecord(record);
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
      unit: { type: 'string', title: '单位' , readOnly: true},
      price: {  type: 'number', title: '含税单价', ui: { prefix: '￥' } as SFNumberWidgetSchema, readOnly: true },
      number: { type: 'number', title: '数量' },
      expectDeliverTime: { type: 'string', ui: { widget: 'date', format: 'YYYY-MM-DD 00:00:00', } as SFDateWidgetSchema, title: '期望交货时间'  },
    },
    required: ['name', 'materialNo', 'format', 'unit', 'price', 'number', 'expectDeliverTime'],
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
      that.providerId = res.providerId;
      if (that.orderId && that.providerId && that.orderId !== '0' && that.providerId !== '0') {
        that.addFlag.first = false;
      }
    });
  }

  ngOnInit() {
    if (this.orderId && this.orderId !== '0') {
      this.queryOrderInfo();
      this.queryOrderDetail();
    }
    if (this.providerId && this.providerId !== '0') {
      this.querySupplyFirmInfo();
    }
  }

  queryOrderInfo() {
    this.http
    .get(Api.BaseSupplyPurchaseApi + this.orderId)
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
    if (this.orderInfo.status === 0) {
      this.currentStep = 1;
    } else if (this.orderInfo.status === 20) {
      this.currentStep = 2;
    } else if (this.orderInfo.status === 40) {
      this.currentStep = 3;
    } else if (this.orderInfo.status === 50) {
      this.currentStep = 4;
    } else if (this.orderInfo.status === 60) {
      this.currentStep = 5;
    } else if (this.orderInfo.status === 80) {
      this.currentStep = 6;
    } else {
      this.currentStep = 1;
    }
  }

  queryOrderDetail() {
    this.http
    .get(Api.BaseSupplyPurchaseApi + 'detail/' + this.orderId)
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
    .get(Api.BaseSupplyFirmApi + this.providerId)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) this.providerInfo = res.data;
      }
    });
  }

  backList(event: any) {
    this.route.navigate(['/supply/purchase']);
  }

  editOrderInfo() {
      this.orderInfoModalVisibility = true;
      if (this.orderInfo.needInvoice === undefined)
        this.orderInfo.needInvoice = true;
  }
  handleOrderInfoModalClose(value: any): void {
    this.orderInfoModalVisibility = false;
    if (value)
      this.orderInfo = value;
  }

  editProviderInfo() {
    this.providerModalVisibility = true;
    this.providerParams.current = 1;
    this.providerParams.size = 10;
    this.queryProvider(null);
  }
  handleProviderInfoModalClose(value: any): void {
    this.providerModalVisibility  = false;
    if (value) {
      // 默认供应商列表项的数据没有id，只有supplierId
      if (!value.id) {
        value.id = value.supplierId;
      }
      const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
      if (firmInfo) {
        if (firmInfo.id === value.id) {
          this.msg.error('不能选择自己的企业作为供应商!');
          return;
        }
      } else {
        this.msg.error('您还未指定当前登陆的是哪个企业');
      }
      this.providerInfo = value;
    }
  }
  queryMaterial(event: any) {
    const current: number = this.materialSearchParams.current || 1;
    const size: number = this.materialSearchParams.size || 10;
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    this.materialSearchParams.firmId = firmInfo.id;
    if (event) {
      if (event.name) this.materialSearchParams.name = event.name;
      if (event.materialNo) this.materialSearchParams.materialNo = event.materialNo;
    }
    this.http
      .get(Api.BaseSupplyMaterialApi + 'page/' + current + '/' + size, this.materialSearchParams)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.materialSearchPage = res.data;
        }
      });
  }
  materialStChange(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.materialSearchParams.size = e.ps;
      this.materialSearchParams.current = e.pi;
      this.queryMaterial(null);
    }
  }
  setTmpMaterialRecord(record) {
    this.tmpMaterialRecord = record;
    delete this.tmpMaterialRecord.id;
    delete this.tmpMaterialRecord.firmId;
  }
  editMaterialInfo(record: any) {
    this.materialModalVisibility = true;
    this.tmpMaterialRecord = record;
    if (!this.tmpMaterialRecord)
      this.queryMaterial(null);
  }
  handleMaterialInfoModalClose(value: any, modify: boolean): void {
    if (value) {
      value.status = 0;
      if (!modify) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.orderDetail.length; i++) {
            if (value.materialNo === this.orderDetail[i].materialNo) {
              this.msg.info('物料编号必须不重复！');
              return;
            }
          }
          value.newFlag = true;
          this.orderDetail.push(value);
      } else {
        for (let i = 0; i < this.orderDetail.length; i++) {
          if (value.materialNo === this.orderDetail[i].materialNo) {
            this.orderDetail[i] = value;
            break;
          }
        }
      }
      this.calculatDetail();
      this.orderDetailSt.reload();
    }
    this.materialModalVisibility = false;
  }
  handleDeleteMaterialInfo(record: any) {
    if (record.id) {
      this.http.delete(Api.BaseSupplyPurchaseApi + 'detail/delete', {detailId: record.id}).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            if (res.data) {
              this.deleteDetail(record);
              this.msg.success('删除成功');
            }
          } else {
            this.msg.warning(res.message);
          }
        } else {
          this.msg.error('删除失败，未知错误');
        }
      });
    } else {
      this.deleteDetail(record);
    }
  }

  deleteDetail(record: any) {
    for (let i = 0; i < this.orderDetail.length; i++) {
      if (record.materialNo === this.orderDetail[i].materialNo) {
        this.orderDetail.splice(i, 1);
        break;
      }
    }
    this.calculatDetail();
    this.orderDetailSt.reload();
  }
  providerPageChange(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.providerParams.size = e.ps;
      this.providerParams.current = e.pi;
      this.queryProvider(null);
    }
  }
  queryProvider(event: any) {
    const current: number = this.providerParams.current || 1;
    const size: number = this.providerParams.size || 10;
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    this.providerParams = {firmId: firmInfo.id};
    if (event) {
      // 搜索时取所有公司列表
      if (event.name) this.providerParams.name = event.name;
      this.http
      .get(Api.BaseSupplyFirmApi + 'page/' + current + '/' + size, this.providerParams)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.providerPage = res.data;
        }
      });
    } else {
      // 默认取供应商管理里的公司列表
      this.http
      .get(Api.BaseSupplySupplierApi + '/page/' + current + '/' + size, this.providerParams)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.providerPage = res.data;
        }
      });
    }
  }
  createNew() {
    this.orderId = '0';
    this.providerId = '0';
    this.orderInfo = {};
    this.orderDetail = [];
    this.providerInfo = {};
    this.providerPage = {
      records: [],
      current: 1,
      total: 0,
      size: 10,
    };
    this.providerPagination = {
      front: false,
      pageSizes: [10, 20, 30, 40, 50],
      total: true,
      showSize: true,
      showQuickJumper: true,
    };
    this.providerParams = {};
    this.tmpMaterialRecord = {};
    this.addFlag = {
      first: true
    };
    this.basicNum = 0;
    this.amountNum = 0;
  }
  saveOrder() {
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    if (!firmInfo) {
      this.msg.error('您还没有选择当前登陆的企业');
      return;
    }
    if (!this.providerInfo.id) {
      this.msg.warning('必须选择一个供应商！');
      return;
    }
    if (this.orderDetail.length === 0) {
      this.msg.warning('请至少添加一个物料!');
      return;
    }
    const orderModel: any = {};
    orderModel.orderInfo = this.orderInfo;
    orderModel.orderInfo.provider = this.providerInfo.id;
    orderModel.orderInfo.consumer = firmInfo.id;
    orderModel.orderInfo.orderSum = this.amountNum;
    orderModel.orderDetail  = this.orderDetail;
    console.log(orderModel);
    if (orderModel.orderInfo.id) {
      this.http.put(Api.BaseSupplyPurchaseApi + '/update', orderModel).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.orderInfo = res.data.orderInfo;
            this.orderDetail = res.data.orderDetail;
            this.calculatDetail();
            this.stepTo();
            this.addFlag.first = false;
            this.msg.success('修改成功');
          } else {
            this.msg.warning(res.message);
          }
        } else {
          this.msg.error('修改失败，未知错误');
        }
      });
    } else {
      this.http.post(Api.BaseSupplyPurchaseApi + 'add', orderModel).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.orderInfo = res.data.orderInfo;
            this.orderDetail = res.data.orderDetail;
            this.calculatDetail();
            this.stepTo();
            this.addFlag.first = false;
            this.msg.success('创建成功');
          } else {
            this.msg.warning(res.message);
          }
        } else {
          this.msg.error('创建失败，未知错误');
        }
      });
    }
  }

  commitPurchaseOrder() {
    this.http.post(Api.BaseSupplyOrderFlowApi + '/purchase/commit/' + this.orderInfo.id).subscribe((res: any) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          this.orderId = this.orderInfo.id;
          this.queryOrderInfo();
          this.msg.success('提交成功');
        } else {
          this.msg.warning(res.message);
        }
      } else {
        this.msg.error('提交失败，未知错误');
      }
    });
  }

  verifyPurchaseOrder() {
    this.http
    .put(Api.BaseSupplyOrderFlowApi + '/purchase/verify/' + this.orderId )
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
}
