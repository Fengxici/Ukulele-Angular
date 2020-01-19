import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzTabChangeEvent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';

@Component({
  selector: 'app-supply-purchase-edit',
  templateUrl: './purchase-edit.component.html',
  styleUrls: ['./purchase-edit.component.less']
})
export class PurchaseEditComponent implements OnInit {
  list: any[] = [];

  data = {
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
  };

  opColumns: STColumn[] = [
    { title: '操作类型', index: 'type' },
    { title: '操作人', index: 'name' },
    { title: '执行结果', index: 'status', render: 'status' },
    { title: '操作时间', index: 'updatedAt', type: 'date' },
    { title: '备注', index: 'memo', default: '-' },
  ];

  basicNum = 0;
  amountNum = 0;
  goods: any = [];
  goodsColumns: STColumn[] = [
    {
      title: '商品编号',
      index: 'id',
      type: 'link',
      click: (item: any) => this.msg.success(`show ${item.id}`),
    },
    { title: '商品名称', index: 'name' },
    { title: '商品条码', index: 'barcode' },
    { title: '单价', index: 'price', type: 'currency' },
    { title: '数量（件）', index: 'num', className: 'text-right' },
    { title: '金额', index: 'amount', type: 'currency' },
  ];

  constructor(public msg: NzMessageService, private http: _HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // this.http.get('/profile/advanced').subscribe((res: any) => {
    //   this.data = res;
    //   this.change({ index: 0, tab: null! });
    //   this.cdr.detectChanges();
    // });
  }
  query(event) {

  }

change(args: NzTabChangeEvent) {
    this.list = this.data[`advancedOperation${args.index + 1}`];
  }


}
