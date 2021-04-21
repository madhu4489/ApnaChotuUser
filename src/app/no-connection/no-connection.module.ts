import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoConnectionPageRoutingModule } from './no-connection-routing.module';

import { NoConnectionPage } from './no-connection.page';
import { Network } from '@ionic-native/network/ngx';
import { CheckConnectivity } from '../providers/check-connectivity/check-connectivity-service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoConnectionPageRoutingModule
  ],
  declarations: [NoConnectionPage],
  providers:[Network, CheckConnectivity]
})
export class NoConnectionPageModule {}
