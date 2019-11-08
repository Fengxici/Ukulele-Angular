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

const routes: Routes = [

  { path: 'firms', component: FirmListComponent },
  { path: 'firm', component: FirmComponent },
  { path: 'material', component: MaterialComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'consumer', component: ConsumerComponent },
  { path: 'market', component: MarketComponent },
  { path: 'purchase', component: PurchaseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyRoutingModule { }
