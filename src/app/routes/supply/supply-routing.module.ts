import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirmListComponent } from './firm/firm-list.component';
import { MarketComponent } from './market/market.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { FirmComponent } from './firm/firm.component';
import { EmployeeComponent } from './user/employee.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { MaterialComponent } from './material/material.component';
import { AdsComponent } from './ads/ads.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { EmployeeApplyComponent } from './join/apply.component';
import { PurchaseEditComponent } from './purchase/purchase-edit.component';
import { MarketEditComponent } from './market/market-edit.component';
import { ReceiveComponent } from './deliver/receive.component';
import { CartComponent } from './deliver/cart.component';
import { ChangeComponent } from './change/change.component';
import { AbnormalComponent } from './abnormal/abnormal.component';
import { AbnormalHandleComponent } from './abnormal/abnormal.handle.component';
import { MyConsumerComponent } from './consumer/my.component';
import { MySupplyComponent } from './supplier/my.component';
import { AddressComponent } from './address/address.component';
import { ChangeApplyComponent } from './change/apply.component';
import { MyMarketComponent } from './market/mymarket.component';
import { MyPurchaseComponent } from './purchase/mypurchase.component';

const routes: Routes = [
  { path: 'firms', component: FirmListComponent },
  { path: 'firm', component: FirmComponent },
  { path: 'material', component: MaterialComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'consumer', component: ConsumerComponent },
  { path: 'market', component: MarketComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'ads', component: AdsComponent},
  { path: 'announce', component: AnnouncementComponent},
  { path: 'join', component: EmployeeApplyComponent},
  { path: 'purchaseAdd', component: PurchaseEditComponent},
  { path: 'marketDetail', component: MarketEditComponent},
  { path: 'cart', component: CartComponent},
  { path: 'purchaseReceive', component: ReceiveComponent},
  { path: 'change', component: ChangeComponent}, // 变更申请
  { path: 'abnormal', component: AbnormalComponent}, // 异常物料
  { path: 'abnormalHandle', component: AbnormalHandleComponent}, // 异常处理
  { path: 'myConsumer', component: MyConsumerComponent}, // 我的客户
  { path: 'mySupply', component: MySupplyComponent}, // 我的供应商
  { path: 'address', component: AddressComponent}, // 收货地址
  { path: 'changeApply', component: ChangeApplyComponent}, // 变更审核
  { path: 'myMarket', component: MyMarketComponent}, // 我的订单
  { path: 'myPurchase', component: MyPurchaseComponent} // 我的采购
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyRoutingModule { }
