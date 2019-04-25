import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigIconComponent } from './icon/icon.component';

const routes: Routes = [

  { path: 'icon', component: ConfigIconComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
