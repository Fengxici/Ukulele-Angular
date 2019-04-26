import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IconComponent } from './icon/icon.component';

const routes: Routes = [

  { path: 'icon', component: IconComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
