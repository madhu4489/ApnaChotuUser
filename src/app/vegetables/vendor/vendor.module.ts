import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorPageRoutingModule } from './vendor-routing.module';

import { VendorPage } from './vendor.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CustomOrdercounterComponent } from 'src/app/components/custom-ordercounter/custom-ordercounter';
import { RemoveItemsComponent } from '../remove-items/remove-items.component';
import { StepperComponent } from '../stepper/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorPageRoutingModule,
    PipesModule
  ],
  declarations: [VendorPage, CustomOrdercounterComponent, RemoveItemsComponent, StepperComponent]
})
export class VendorPageModule {}
