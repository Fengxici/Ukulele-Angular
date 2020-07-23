import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn, STColumnBadge } from '@delon/abc';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'app-supply-receive-edit',
  templateUrl: './receive-edit.component.html',
})
export class ReceiveEditComponent
  implements OnInit, OnDestroy {
    constructor(
      private modal: NzModalRef,
      private msg: NzMessageService,
      public http: _HttpClient,
    ) {}
    record: any = {};
    data: any = [];
    checkInVisible = false;
    checkBackVisible = false;
    i: any;
    schema: SFSchema = {
      properties: {
        deliverNo: { type: 'string', title: '发货单号', maxLength: 15 }
      },
      required: ['name'],
    };
    ui: SFUISchema = {
      '*': {
        spanLabel: 10,
        spanControl: 14,
        grid: { span: 12 },
      },
    };
    DELIVER_STATUS: STColumnBadge = {
      0: {text: '创建', color: 'default'},
      5: {text: '待审批', color: 'processing'},
      10: {text: '待发货', color: 'processing'},
      15: {text: '发货中', color: 'processing'},
      20: {text: '已签收', color: 'success'},
      88: {text: '入库', color: 'success'},
      99: {text: '退货', color: 'error'}
    };
    @ViewChild('st', { static: true }) cart: STComponent;
    columns: STColumn[] = [
      { title: '物料编号', index: 'materialNo'},
      { title: '物料名称', index: 'name' },
      { title: '规格', index: 'format' },
      { title: '单位', index: 'unit' },
      { title: '数量', index: 'number', className: 'text-right' },
      { title: '期望交货时间', index: 'expectDeliverTime', type: 'date' },
      { title: '预计交货时间', index: 'estimateDeliverTime', type: 'date' },
      { title: '采购订单编号', index: 'purchaseNo' },
      { title: '销售订单编号', index: 'marketNo' },
      { title: '状态', index: 'status' , type: 'badge', badge: this.DELIVER_STATUS},
      {
        title: '操作',
        buttons: [
          {
            text: '入库',
            icon: 'edit',
            iif: record => record.status === 20,
            pop: {
              title: '确定该将物料入库吗?',
              okType: 'default',
              icon: 'star',
            },
            click: (record) => {
              this.check(record, 0);
            },
          },
          {
            text: '退货',
            icon: 'edit',
            iif: record => record.status === 20,
            pop: {
              title: '确定该物料需发起退货吗?',
              okType: 'default',
              icon: 'star',
            },
            click: (record) => {
              this.check(record, 1);
            },
          }
        ],
      },
    ];
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.query();
  }
  close() {
    this.modal.destroy();
  }
  query() {
    this.http
      .get(Api.BaseSupplyDeliverUrl + 'detail', {id: this.record.id})
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.data = res.data;
        }
      });
  }
  // 验收 0 签收 1 退货
  check(record: any, result: number) {
    console.log(record);
    const params: any =  {};
    params.deliverDetailId = record.id;
    params.deliverId = record.deliverId;
    params.result = result;
    this.http
          .put(Api.BaseSupplyDeliverUrl + 'material/check', null, params)
          .subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.query();
                this.msg.success('签收成功');
              } else {
                this.msg.warning(res.message);
              }
            } else {
              this.msg.error('签收失败，未知错误');
            }
          });
  }

  // 验收 0 签收 1 退货
  allCheck(result: number) {
    const params: any =  {};
    params.deliverId = this.record.id;
    params.result = result;
    this.http
      .put(Api.BaseSupplyDeliverUrl + 'check', null, params)
      .subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.query();
            this.msg.success(result === 1 ? '退货成功' : '入库成功');
          } else {
            this.msg.warning(res.message);
          }
        } else {
          this.msg.error(result === 1 ? '退货失败，未知错误' : '入库失败，未知错误');
        }
      });
  }
}
