import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NavController, Platform } from '@ionic/angular';


// import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { FCM } from '@ionic-native/fcm/ngx';

import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { SharedService } from './providers/shared.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private navController: NavController, private network: Network,
    private platform: Platform,
    // private statusBar: StatusBar,
    private firebaseX: FirebaseX,
    public sharedService: SharedService,
    // private uniqueDeviceID: UniqueDeviceID
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

      // this.uniqueDeviceID.get()
      // .then((uuid: any) => {
      //   console.log(uuid, "device ID");
      //   if(uuid){
      //     localStorage.setItem("deviceId", JSON.stringify(uuid))
      //   }
      // })
      // .catch((error: any) => console.log(error));

      console.log('platform ready Madhuuuuuuuuuuuuuuu');

      this.firebaseX.getToken()
        .then(token =>{
          console.log(token, "token ID");
          if(token){
            localStorage.setItem("deviceToken", JSON.stringify(token))
          }
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error('Error getting token', error));

    this.firebaseX.onMessageReceived()
      .subscribe(data => {
        
        
        if (localStorage.getItem('userDetails')) {
          console.log(`User opened a notification ${JSON.stringify(data)}`)
          this.sharedService.presentToastWithOptionsNotificarion(
            'Order Status!',
            'Your order has been updated.',
            'success',
             6000
          );
         
        }else{
          this.sharedService.presentToastWithOptionsNotificarion(
            'Order Status!',
            'Please login and check the Order Status.',
            'warning', 
            6000
          );
        }


        
        console.log(`out notification ${JSON.stringify(data)}`);
      });

    this.firebaseX.onTokenRefresh()
      .subscribe((token: string) => {
        if(token){
          localStorage.setItem("deviceToken", JSON.stringify(token))
        }
      });



    
      // this.statusBar.styleDefault();
    
      // this.fcm.getToken().then(token => {
      //   console.log(token, "token");
      // });

      // this.fcm.onNotification().subscribe(data => {
      //   console.log(data, "onNotification");
      //   if (data.wasTapped) {
      //     console.log('Received in background');
      //   } else {
      //     console.log('Received in foreground');
      //   }
      // });      

      // this.fcm.onTokenRefresh().subscribe(token => {
      //   console.log(token);
      // });

      // unsubscribe from a topic
      // this.fcm.unsubscribeFromTopic('offers');

    });
  }
}
