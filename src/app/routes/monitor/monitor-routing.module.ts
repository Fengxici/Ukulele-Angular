import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorLogComponent } from './log/log.component';
import { MonitorNodeComponent } from './node/node.component';

const routes: Routes = [
  { path: 'log', component: MonitorLogComponent },
  {path: 'node', component: MonitorNodeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorRoutingModule { }
