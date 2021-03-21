import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodVendorPage } from './food-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: FoodVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodVendorPageRoutingModule {}
