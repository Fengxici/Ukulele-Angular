import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreUserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'user', component: StoreUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
