import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigIconComponent } from './icon/icon.component';

const COMPONENTS = [
  ConfigIconComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    ConfigRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ConfigModule { }
