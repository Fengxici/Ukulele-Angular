
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn, STColumnBadge } from '@delon/abc';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'app-firm-order-popover',
  template: `
            <i nz-icon nzType="info-circle" nz-popover nzPopoverTitle="订单详情" [nzPopoverContent]="contentTemplate"
            nzPopoverPlacement="right" (nzVisibleChange)="visibleChanged($event)"></i>
            <ng-template #contentTemplate>
              <nz-card [nzHoverable]="true" [nzBordered]="false"  nzTitle="流程进度">
                <nz-steps [nzCurrent]="currentStep" nzProgressDot *ngIf="supply==false">
                  <nz-step [nzTitle]="'提交订单'" [nzDescription]="createDesc">
                    <ng-template #createDesc>
                      <div class="desc">
                        <div class="my-sm">
                          {{orderInfo.createBy}}
                        </div>
                        <div>{{orderInfo.createTime}}</div>
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'确认'" [nzDescription]="verifyDesc">
                    <ng-template #verifyDesc>
                      <div class="desc">
                        <div class="my-sm">
                          {{orderInfo.verifyBy}}
                        </div>
                        {{orderInfo.verifyTime}}
                        <a (click)="verifyOrder()" *ngIf="orderInfo.status===20">确认</a>
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'采购商确认'" [nzDescription]="consumerVerifyDesc">
                    <ng-template #consumerVerifyDesc>
                      <div class="desc">
                        <a *ngIf="orderInfo.status===40">催一下</a>
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'安排中'" [nzDescription]="produceDesc">
                    <ng-template #produceDesc>
                      <a (click)="markingOrder()" *ngIf="orderInfo.status===50">确认</a>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'发货中'" [nzDescription]="deliverDesc">
                    <ng-template #deliverDesc>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'完成'"></nz-step>
                </nz-steps>
                <nz-steps [nzCurrent]="currentStep" nzProgressDot *ngIf="supply==true">
                  <nz-step [nzTitle]="'创建订单'" [nzDescription]="createDesc">
                    <ng-template #createDesc>
                      <div class="desc">
                        <div class="my-sm">
                          {{orderInfo.createBy}}
                        </div>
                        <div>{{orderInfo.orderTime}}</div>
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'提交订单'" [nzDescription]="commitDesc">
                    <ng-template #commitDesc>
                      <div class="desc">
                        <div class="my-sm">
                          {{orderInfo.commitBy}}
                        </div>
                        <div>{{orderInfo.commitTime}}</div>
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'供应商确认'" [nzDescription]="verifyDesc">
                    <ng-template #verifyDesc>
                      <div class="desc">
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'订单确认'" [nzDescription]="consumerVerifyDesc">
                    <ng-template #consumerVerifyDesc>
                      <div class="desc">
                        <div class="my-sm">
                          {{orderInfo.verifyBy}}
                        </div>
                        {{orderInfo.verifyTime}}
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'安排中'" [nzDescription]="produceDesc">
                    <ng-template #produceDesc>
                      <div class="desc">
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'供应商发货中'" [nzDescription]="deliverDesc">
                    <ng-template #deliverDesc>
                      <div class="desc">
                      </div>
                    </ng-template>
                  </nz-step>
                  <nz-step [nzTitle]="'完成'"></nz-step>
                </nz-steps>
                <div class="steps-content"></div>
              </nz-card>
              <nz-card nzTitle="订单明细" [nzHoverable]="true" [nzBordered]="false" >
                <sv-container size="large" title="{{title}}">
                  <sv label="名称">{{providerInfo.name}}</sv>
                  <sv label="联系人">{{providerInfo.contacts}}</sv>
                  <sv label="联系电话">{{providerInfo.phone}}</sv>
                  <sv label="社会统一信用代码">{{providerInfo.unicode}}</sv>
                  <sv label="地址">{{providerInfo.address}}</sv>
                </sv-container>
                <nz-divider></nz-divider>
                <div class="text-lg mb-md">物料清单</div>
                <st #orderDetailSt [data]="orderDetail" [columns]="detailColumns" [body]="detailBody" [page]="{ show: false }">
                  <ng-template #detailBody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td class="text-right">合计</td>
                      <td class="text-right">
                        <strong>{{ basicNum }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{ amountNum | _currency }}</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </ng-template>
                </st>
              </nz-card>
            </ng-template>
            `
})
export class  OrderPopoverComponent {
  constructor(
    protected http: _HttpClient,
  ) {}
  @Input() orderId: number;
  @Input() supply: boolean;
  title = '供应商信息';
  orderInfo: any = {};
  providerInfo: any = {};
  currentStep = 1;
  orderDetail: any[] = [];
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
    { title: '变更状态', index: 'changeStatus', type: 'badge', badge: this.CHANGE_STATUS },
  ];

  visibleChanged( value: boolean ): void {
    if (value) {
      if (this.supply)
        this.queryPurchaseOrderInfo();
      else
        this.queryMarketOrderInfo();
      this.queryOrderDetail();
    } else {
      this.orderInfo = {};
      this.providerInfo = {};
      this.currentStep = 0;
      this.orderDetail = [];
      this.basicNum = 0;
      this.amountNum = 0;
    }
  }

  queryPurchaseOrderInfo() {
    this.title = '供应商信息';
    this.http
    .get(Api.BaseSupplyPurchaseApi + this.orderId)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.orderInfo = res.data;
          this.querySupplyFirmInfo(this.orderInfo.provider);
          this.purchaseStepTo();
        }
      }
    });
  }

  queryMarketOrderInfo() {
    this.title = '采购商信息';
    this.http
    .get(Api.BaseSupplyMarketApi + this.orderId)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.orderInfo = res.data;
          this.querySupplyFirmInfo(this.orderInfo.consumer);
          this.marketStepTo();
        }
      }
    });
  }

  purchaseStepTo() {
    if (this.orderInfo.status === 0) {
      this.currentStep = 0;
    } else if (this.orderInfo.status === 20) {
      this.currentStep = 1;
    } else if (this.orderInfo.status === 40) {
      this.currentStep = 2;
    } else if (this.orderInfo.status === 50) {
      this.currentStep = 3;
    } else if (this.orderInfo.status === 60) {
      this.currentStep = 4;
    } else if (this.orderInfo.status === 80) {
      this.currentStep = 5;
    }  else if (this.orderInfo.status === 90) {
      this.currentStep = 6;
    } else {
      this.currentStep = 0;
    }
  }

  marketStepTo() {
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

  querySupplyFirmInfo(providerId) {
    this.http
    .get(Api.BaseSupplyFirmApi + providerId)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) this.providerInfo = res.data;
      }
    });
  }
}
