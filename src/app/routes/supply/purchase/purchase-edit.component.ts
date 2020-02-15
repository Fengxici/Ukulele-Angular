import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STColumn, STPage, STComponent, STChange } from '@delon/abc';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { SFSchema, SFStringWidgetSchema, SFUISchema, SFDateWidgetSchema, SFTextareaWidgetSchema } from '@delon/form';

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
  orderInfoModalVisibility = false;
  providerModalVisibility = false;
  materialModalVisibility = false;
  addFlag = {
    first: true
  };
  currentStep = 1;
  basicNum = 0;
  amountNum = 0;
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
    { title: '期望交货时间', index: 'expectDeliverTime', type: 'date' },
    { title: '预计交货时间', index: 'estimateDeliverTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '修改',
          icon: 'edit',
          click: (record) => {
            this.editMaterialInfo(record);
          },
          iif: record => record.status < 5
        },
        {
          text: '删除',
          icon: 'delete',
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

  materialSchema: SFSchema = {
    properties: {
      materialNo: { type: 'string', title: '物料编号', maxLength: 15 },
      name: { type: 'string', title: '物料名称' },
      format: { type: 'string', title: '规格' },
      unit: { type: 'string', title: '单位' },
      number: { type: 'number', title: '数量' },
      expectDeliverTime: { type: 'string', ui: { widget: 'date', showTime: true } as SFDateWidgetSchema, title: '期望交货时间'  },
    },
    required: ['name', 'materialNo', 'format', 'unit', 'number', 'expectDeliverTime'],
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
    this.router.params.subscribe((res) => {
      const params = JSON.parse(res.queryParams);
      that.orderId = params.orderId;
      that.providerId = params.providerId;
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
          if (this.orderInfo.status === 0) {
            this.currentStep = 1;
          } else if (this.orderInfo.status === 5) {
            this.currentStep = 2;
          } else if (this.orderInfo.status === 10) {
            this.currentStep = 3;
          } else {
            this.currentStep = 4;
          }
        }
      }
    });
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

  editMaterialInfo(record: any) {
    this.materialModalVisibility = true;
    this.tmpMaterialRecord = record;
  }
  handleMaterialInfoModalClose(value: any, modify: boolean): void {
    if (value) {
      value.price = 0;
      if (!modify) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.orderDetail.length; i++) {
            if (value.materialNo === this.orderDetail[i].materialNo) {
              this.msg.info('物料编号必须不重复！');
              return;
            }
          }
          this.orderDetail.push(value);
      } else {
        for (let i = 0; i < this.orderDetail.length; i++) {
          if (value.id === this.orderDetail[i].id) {
            this.orderDetail[i] = value;
            break;
          }
        }
      }
      this.calculatDetail();
      this.st.reload();
    }
    this.materialModalVisibility = false;
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
    this.providerParams = {};
    if (event) {
      if (event.name) this.providerParams.name = event.name;
    }
    this.http
      .get(Api.BaseSupplyFirmApi + 'page/' + current + '/' + size, this.providerParams)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.providerPage = res.data;
        }
      });
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
            this.msg.success('修改成功');
          } else {
            this.msg.warning(res.message);
          }
        } else {
          this.msg.error('修改失败，未知错误');
        }
      });
    } else {
      this.http.post(Api.BaseSupplyPurchaseApi + '/add', orderModel).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.orderInfo = res.data.orderInfo;
            this.orderDetail = res.data.orderDetail;
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
          this.orderInfo.status = 5;
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