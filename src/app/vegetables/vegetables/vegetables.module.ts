import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VegetablesPageRoutingModule } from './vegetables-routing.module';

import { VegetablesPage } from './vegetables.page';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VegetablesPageRoutingModule,
    PipesModule
  ],
  declarations: [VegetablesPage]
})
export class VegetablesPageModule {}
