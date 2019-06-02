import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SystemRoutingModule } from './system-routing.module';
import { SystemDeptComponent } from './dept/dept.component';
import { SystemRoleComponent } from './role/role.component';
import { SystemMenuComponent } from './menu/menu.component';
import { SystemUserComponent } from './user/user.component';
import { SystemDictComponent } from './dict/dict.component';
import { UserEditComponent } from './user/user-edit.component';
import { RoleEditComponent } from './role/role-edit.component';
import { DictEditComponent } from './dict/dict-edit.component';
import { MenuEditComponent } from './menu/menu-edit.component';
import { DictIndexEditComponent } from './dict/dict-index-edit.component';

const COMPONENTS = [
  SystemDeptComponent,
  SystemRoleComponent,
  SystemMenuComponent,
  SystemUserComponent,
  SystemDictComponent,
];
const COMPONENTS_NOROUNT = [
  UserEditComponent,
  RoleEditComponent,
  DictEditComponent,
  DictIndexEditComponent,
  MenuEditComponent
];

@NgModule({
  imports: [SharedModule, SystemRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SystemModule {}
