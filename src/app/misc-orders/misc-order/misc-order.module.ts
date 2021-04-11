import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiscOrderPageRoutingModule } from './misc-order-routing.module';

import { MiscOrderPage } from './misc-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiscOrderPageRoutingModule
  ],
  declarations: [MiscOrderPage]
})
export class MiscOrderPageModule {}
