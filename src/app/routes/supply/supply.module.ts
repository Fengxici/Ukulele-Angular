import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SupplyRoutingModule } from './supply-routing.module';
import { FirmListComponent } from './firm/firm-list.component';
import { FirmEditComponent } from './firm/firm-edit.component';
import { MarketComponent } from './market/market.component';
import { MarketEditComponent } from './market/market-edit.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { FirmComponent } from './firm/firm.component';
import { EmployeeComponent } from './user/employee.component';
import { EmployeeEditComponent } from './user/employee-edit.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierEditComponent } from './supplier/supplier-edit.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { ConsumerEditComponent } from './consumer/consumer-edit.component';
import { MaterialEditComponent } from './material/material-edit.component';
import { MaterialComponent } from './material/material.component';
import { AdsComponent } from './ads/ads.component';
import { AdsEditComponent } from './ads/ads-edit.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementEditComponent } from './announcement/announcement-edit.component';
import { EmployeeApplyComponent } from './join/apply.component';
import { EmployeeApplyHandleComponent } from './join/apply-access.component';
import { PurchaseEditComponent } from './purchase/purchase-edit.component';
import { ReceiveComponent } from './deliver/receive.component';
import { DeliverEditComponent } from './deliver/deliver-edit.component';
import { CartComponent } from './deliver/cart.component';
import { ReceiveEditComponent } from './deliver/receive-edit.component';

const COMPONENTS = [
  FirmListComponent,
  FirmComponent,
  EmployeeComponent,
  SupplierComponent,
  ConsumerComponent,
  MarketComponent,
  PurchaseComponent,
  MaterialComponent,
  AdsComponent,
  AnnouncementComponent,
  EmployeeApplyComponent,
  PurchaseEditComponent,
  MarketEditComponent,
  CartComponent,
  ReceiveComponent
];
const COMPONENTS_NOROUNT = [
  FirmEditComponent,
  EmployeeEditComponent,
  SupplierEditComponent,
  ConsumerEditComponent,
  MaterialEditComponent,
  AdsEditComponent,
  AnnouncementEditComponent,
  EmployeeApplyHandleComponent,
  DeliverEditComponent,
  ReceiveEditComponent
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
