import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiscOrderPage } from './misc-order.page';

const routes: Routes = [
  {
    path: '',
    component: MiscOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiscOrderPageRoutingModule {}
