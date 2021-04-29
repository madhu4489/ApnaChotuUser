import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewKartPage } from './view-kart.page';



const routes: Routes = [
  {
    path: '',
    component: ViewKartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewKartModuleRoutingModule {}
