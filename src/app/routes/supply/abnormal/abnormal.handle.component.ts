import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { STColumnBadge, STComponent, STColumn, STChange } from '@delon/abc';
import { FirmDrawerComponent } from '../common/firm-drawer.component';
@Component({
  selector: 'app-supply-abnormal-handle',
  templateUrl: './abnormal.handle.component.html',
})
export class AbnormalHandleComponent extends BaseAbilityComponent
implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
  params: any = {};
  listRecord: any = [];
  deliverData: any = [];
  searchSchema: SFSchema = {
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
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('drawer', {static: true }) firmDraw: FirmDrawerComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id.value', type: 'checkbox' },
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

  query(event: any) {
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    if (!firmInfo){
      this.msg.warning('');
    }
    this.http
      .get(Api.BaseSupplyMarketApi + 'detail/abnormal/' + firmInfo.id)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.listRecord = res.data;
          else this.listRecord = [];
          if (this.listRecord)
            this.listRecord.forEach(element => {
              element.subtotal = element.price * element.number;
            });
        }
      });
  }

  stChange(e: STChange) {
    console.log('change', e);
    if (e.type === 'checkbox') {
      this.deliverData = e.checkbox;
      console.log(this.deliverData);
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
      .post(Api.BaseSupplyDeliverUrl + 'deliver/1', data)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
            this.msg.success('发货成功,请至订单发货中查看');
            this.deliverData = [];
            this.query(null);
        } else {
          this.msg.error((res && res.message) ? res.messagem : '未知错误' );
        }
      });
  }
}
