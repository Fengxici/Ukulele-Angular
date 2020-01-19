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
  { path: 'purchaseAdd', component: PurchaseEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyRoutingModule { }
