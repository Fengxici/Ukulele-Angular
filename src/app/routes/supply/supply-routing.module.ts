import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirmComponent } from './firm/firm.component';

const routes: Routes = [

  { path: 'firm', component: FirmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyRoutingModule { }
