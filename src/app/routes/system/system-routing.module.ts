import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemDeptComponent } from './dept/dept.component';
import { SystemRoleComponent } from './role/role.component';
import { SystemMenuComponent } from './menu/menu.component';
import { SystemUserComponent } from './user/user.component';
import { SystemDictComponent } from './dict/dict.component';

const routes: Routes = [

  { path: 'dept', component: SystemDeptComponent },
  { path: 'role', component: SystemRoleComponent },
  { path: 'menu', component: SystemMenuComponent },
  { path: 'user', component: SystemUserComponent },
  { path: 'dict', component: SystemDictComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
