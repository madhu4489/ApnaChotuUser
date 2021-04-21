import { Injectable } from '@angular/core';


import { Platform } from '@ionic/angular';
  
import { Network } from '@ionic-native/network/ngx';


@Injectable()
export class CheckConnectivity {

  onDevice: boolean;

  constructor( private network : Network, private platform: Platform) {
    this.onDevice  = this.platform.is('cordova');

  }

  // ---- if there isn't any connection
  noConnection(){

    console.log('type"::::', this.network.type);

    return( this.network.type === 'none');
  }



  // ------ if device is offline ---
  isOffline(): boolean{
    if(this.onDevice && this.network.type){
      return this.network.type == 'none';
    }
    else{
      return !navigator.onLine;
    }
  }
    
}