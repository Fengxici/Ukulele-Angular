import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SupplyRoutingModule } from './supply-routing.module';
import { FirmComponent } from './firm/firm.component';
import { FirmEditComponent } from './firm/firm-edit.component';

const COMPONENTS = [FirmComponent];
const COMPONENTS_NOROUNT = [
  FirmEditComponent];

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
