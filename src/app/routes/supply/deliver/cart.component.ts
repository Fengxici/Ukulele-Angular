import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { STComponent, STColumn, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { AdsEditComponent } from '../ads/ads-edit.component';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { DeliverEditComponent } from './deliver-edit.component';

@Component({
  selector: 'app-supply-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
  cartParams: any = {};
  listParams: any = {};
  cartRecord: any;
  listRecord: any;
  deliverData: any = [];
  cartSearchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称'
      },
    },
  };
  listSearchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称'
      },
    },
  };
  @ViewChild('cart', { static: true }) cart: STComponent;
  @ViewChild('list', { static: true }) list: STComponent;
  cartColumns: STColumn[] = [
    { title: '编号', index: 'id.value', type: 'checkbox' },
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
  listColumns: STColumn[] = [
    { title: '发货单号', index: 'deliverNo'},
    {
      title: '操作',
      buttons: [
        {
          text: '物料明细',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: DeliverEditComponent,
          },
          click: () => {
            this.listQuery(null);
          },
        },
        {
          text: '审核',
          icon: 'edit',
          click: (record) => {
            this.verifyDeliver(record);
          },
        }
      ],
    },
  ];
  ngOnInit() {
    this.cartQuery(null);
    this.listQuery(null);
  }

  ngOnDestroy(): void {
    super.clearAbilities();
  }

  cartQuery(event: any) {
    if (event) {
      if (event.name) this.cartParams.name = event.name;
    }
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    this.cartParams.firmId = firmInfo.id;
    this.http
      .get(Api.BaseSupplyDeliverUrl + 'cart', this.cartParams)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.cartRecord = res.data;
        }
      });
  }

  listQuery(event: any) {
    const current: number = this.listParams.current || 1;
    const size: number = this.listParams.size || 10;
    if (event) {
      if (event.name) this.listParams.name = event.name;
    }
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    this.listParams.firmId = firmInfo.id;
    this.http
      .get(Api.BaseSupplyDeliverUrl + 'page/' + current + '/' + size + '/0', this.listParams)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.listRecord = res.data.records;
        }
      });
  }

  cartChange(e: STChange) {
    console.log('change', e);
    if (e.type === 'checkbox') {
      this.deliverData = e.checkbox;
      console.log(this.deliverData);
    }
  }

  listChange(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.listParams.size = e.ps;
      this.listParams.current = e.pi;
      this.listQuery(null);
    }
  }

  deliver() {
    if (!(this.deliverData && this.deliverData.length > 0) ) {
      this.msg.error('请先选择要发货的物料');
      return;
    }
    const data = [];
    this.deliverData.forEach(element => {
      data.push(element.id);
    });
    this.http
      .post(Api.BaseSupplyDeliverUrl + 'deliver', data)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            this.msg.success('发货成功');
            this.deliverData = [];
            this.cartQuery(null);
          } else this.msg.error(res.message);
        } else {
          this.msg.error((res && res.message) ? res.messagem : '未知错误' );
        }
      });
  }

  verifyDeliver(record) {
    console.log(record);
  }
}
