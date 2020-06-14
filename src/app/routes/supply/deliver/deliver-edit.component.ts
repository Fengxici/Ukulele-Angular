import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {  SFUISchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn, STColumnBadge } from '@delon/abc';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'app-supply-deliver-edit',
  templateUrl: './deliver-edit.component.html',
})
export class DeliverEditComponent
  implements OnInit, OnDestroy {
    constructor(
      private modal: NzModalRef,
      private msgSrv: NzMessageService,
      public http: _HttpClient,
    ) {}
    record: any = {};
    data: any = [];
    i: any;
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
      30: {text: '完成', color: 'success'},
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
}
