import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorLogComponent } from './log/log.component';
import { MonitorNodeComponent } from './node/node.component';

const COMPONENTS = [
  MonitorLogComponent, MonitorNodeComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    MonitorRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class MonitorModule { }
