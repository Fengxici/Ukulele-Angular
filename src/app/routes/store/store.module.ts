import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { StoreRoutingModule } from './store-routing.module';
import { StoreUserComponent } from './user/user.component';
import { StoreUserEditComponent } from './user/user-edit.component';
import { StoreDiskComponent } from './disk/disk.component';
import { GroupComponent } from './group/group.component';
import { GroupEditComponent } from './group/group-edit.component';
import { GroupUserComponent } from './group/group-user.component';

const COMPONENTS = [
  StoreUserComponent,
  StoreDiskComponent,
  GroupComponent
];
const COMPONENTS_NOROUNT = [
  StoreUserEditComponent,
  GroupEditComponent,
  GroupUserComponent
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
