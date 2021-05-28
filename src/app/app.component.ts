import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NavController, Platform } from '@ionic/angular';


// import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { FCM } from '@ionic-native/fcm/ngx';

import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { SharedService } from './providers/shared.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private navController: NavController, private network: Network,
    private platform: Platform,
    private firebaseX: FirebaseX,
    public sharedService: SharedService,
   ) {
    // private fcm: FCM

      this.initializeApp();
    }

  ngOnInit() {
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.navController.navigateRoot(['./no-connection']);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      localStorage.setItem("deviceId", "2qwaskjbdf67t67d")

      this.firebaseX.getToken()
        .then(token =>{
          console.log(token, "token ID getToken");
          if(token){
            localStorage.setItem("deviceToken", JSON.stringify(token))
          }
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error('Error getting token', error));

    this.firebaseX.onMessageReceived()
      .subscribe(data => {
        
        if(data.tap == "background"){
          console.log(`User Tapped a notification ${JSON.stringify(data)}`);
          
          this.navController.navigateForward(['/orders', '']);
          
        }else{

          if (localStorage.getItem('userDetails')) {
            console.log(`Open APP notification ${JSON.stringify(data)}`)
            this.sharedService.presentToastWithOptionsNotificarion(
              `Order #${data.orderId} Status!`,
              `${data.body}.`,
              'primary',
               6000
            );
           
          }else{
            this.sharedService.presentToastWithOptionsNotificarion(
              `Order #${data.orderId} Status!`,
              `${data.body}. You can login and find more Informtoin`,
              'warning', 
              6000
            );
          }

        }
        
        

      });

    this.firebaseX.onTokenRefresh()
      .subscribe((token: string) => {
        if(token){
          console.log(`onTokenRefresh ${JSON.stringify(token)}`)
          localStorage.setItem("deviceToken", JSON.stringify(token))
        }
      })



    });
  }
}
