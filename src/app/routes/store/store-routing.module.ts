import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreUserComponent } from './user/user.component';
import { StoreDiskComponent } from './disk/disk.component';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  { path: 'user', component: StoreUserComponent },
  { path: 'group', component: GroupComponent },
  { path: 'disk', component: StoreDiskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
