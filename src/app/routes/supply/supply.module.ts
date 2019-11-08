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
import { ConsumerComponent } from './consumer/consumer.component';
import { ConsumerEditComponent } from './consumer/consumer-edit.component';
import { MaterialEditComponent } from './material/material-edit.component';
import { MaterialComponent } from './material/material.component';

const COMPONENTS = [
  FirmListComponent,
  FirmComponent,
  EmployeeComponent,
  SupplierComponent,
  ConsumerComponent,
  MarketComponent,
  PurchaseComponent,
  MaterialComponent
];
const COMPONENTS_NOROUNT = [
  FirmEditComponent,
  EmployeeEditComponent,
  SupplierEditComponent,
  ConsumerEditComponent,
  MarketEditComponent,
  PurchaseEditComponent,
  MaterialEditComponent
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
