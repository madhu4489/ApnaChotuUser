import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChooseLocationComponent } from './choose-location.component';



@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [ChooseLocationComponent],
  exports: [ChooseLocationComponent]
})
export class ChooseLocationComponentModule {}
