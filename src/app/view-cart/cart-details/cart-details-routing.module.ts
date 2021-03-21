import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartDetailsPage } from './cart-details.page';

const routes: Routes = [
  {
    path: '',
    component: CartDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartDetailsPageRoutingModule {}
