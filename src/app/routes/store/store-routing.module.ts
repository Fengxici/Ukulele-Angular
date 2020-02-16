import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreUserComponent } from './user/user.component';
import { StoreDiskComponent } from './disk/disk.component';

const routes: Routes = [
  { path: 'user', component: StoreUserComponent },
  { path: 'disk', component: StoreDiskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
