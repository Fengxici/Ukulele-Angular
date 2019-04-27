import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorLogComponent } from './log/log.component';

const routes: Routes = [

  { path: 'log', component: MonitorLogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorRoutingModule { }
