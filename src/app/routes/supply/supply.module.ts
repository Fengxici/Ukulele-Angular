import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SupplyRoutingModule } from './supply-routing.module';
import { FirmListComponent } from './firm/firm-list.component';
import { FirmEditComponent } from './firm/firm-edit.component';
import { MarketComponent } from './market/market.component';
import { MarketEditComponent } from './market/market-edit.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseEditComponent } from './purchase/purchase-edit.component';
import { FirmComponent } from './firm/firm.component';
import { EmployeeComponent } from './user/employee.component';
import { EmployeeEditComponent } from './user/employee-edit.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierEditComponent } from './supplier/supplier-edit.component';

const COMPONENTS = [FirmListComponent, FirmComponent, EmployeeComponent, SupplierComponent, MarketComponent, PurchaseComponent];
const COMPONENTS_NOROUNT = [
  FirmEditComponent,
  EmployeeEditComponent,
  SupplierEditComponent,
  MarketEditComponent,
  PurchaseEditComponent
];

@NgModule({
  imports: [
    SharedModule,
    SupplyRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SupplyModule { }
