import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreServicerPageRoutingModule } from './more-servicer-routing.module';

import { MoreServicerPage } from './more-servicer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreServicerPageRoutingModule
  ],
  declarations: [MoreServicerPage]
})
export class MoreServicerPageModule {}
