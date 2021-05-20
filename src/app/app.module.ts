import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';

import { StatusBar } from '@ionic-native/status-bar/ngx';

// import FCM
// import { FCM } from '@ionic-native/fcm/ngx';


import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,FormsModule,
    ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FirebaseX, HTTP, Network, StatusBar, UniqueDeviceID],
  bootstrap: [AppComponent],
})
export class AppModule {}
