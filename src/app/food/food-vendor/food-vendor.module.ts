import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodVendorPageRoutingModule } from './food-vendor-routing.module';

import { FoodVendorPage } from './food-vendor.page';
import { CustomCounterComponent } from 'src/app/components/custom-counter/custom-counter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodVendorPageRoutingModule
  ],
  declarations: [FoodVendorPage, CustomCounterComponent]
})
export class FoodVendorPageModule {}
