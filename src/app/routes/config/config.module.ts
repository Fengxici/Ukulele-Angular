import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ConfigRoutingModule } from './config-routing.module';
import { IconComponent } from './icon/icon.component';
import { IconEditComponent } from './icon/icon-edit.component';

const COMPONENTS = [IconComponent];
const COMPONENTS_NOROUNT = [
  IconEditComponent];

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
