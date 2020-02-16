import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { StoreRoutingModule } from './store-routing.module';
import { StoreUserComponent } from './user/user.component';
import { StoreUserEditComponent } from './user/user-edit.component';

const COMPONENTS = [
  StoreUserComponent
];
const COMPONENTS_NOROUNT = [
  StoreUserEditComponent
];

@NgModule({
  imports: [
    SharedModule,
    StoreRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class StoreModule { }