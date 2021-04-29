import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewKartModuleRoutingModule } from './view-kart-routing.module';



import { ViewKartPage } from './view-kart.page';
import { StepperComponent } from '../stepper/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewKartModuleRoutingModule
  ],
  declarations: [ViewKartPage, StepperComponent]
})
export class ViewKartPageModule {}
