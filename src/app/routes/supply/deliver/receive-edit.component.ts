import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn } from '@delon/abc';
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
      private msgSrv: NzMessageService,
      public http: _HttpClient,
    ) {}
    record: any = {};
    data: any = [];
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
