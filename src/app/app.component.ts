import { Component, OnInit, ViewChild } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';

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

  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  
  constructor(private navController: NavController, private network: Network,
    private platform: Platform,
    private firebaseX: FirebaseX,
    public sharedService: SharedService,
    public alertController: AlertController,
    private _location: Location,
    // private routerOutlet: IonRouterOutlet
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

    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log('Back press handler!', this.routerOutlet);

      if (!this.routerOutlet.canGoBack()) {
        this.showExitConfirm();
      }else{
        this._location.back();
      }


      // if (this._location.isCurrentPathEqualTo('/dashboard')) {

      //   // Show Exit Alert!
      //   console.log('Show Exit Alert!');
      //   this.showExitConfirm();
      //   // processNextHandler();
      // } else {

      //   // Navigate to back page
      //   console.log('Navigate to back page');
      //   this._location.back();

      // }

    });

    // this.platform.backButton.subscribeWithPriority(5, () => {
    //   console.log('Handler called to force close!');
    //   this.alertController.getTop().then(r => {
    //     if (r) {
    //       navigator['app'].exitApp();
    //     }
    //   }).catch(e => {
    //     console.log(e);
    //   })
    // });


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

  showExitConfirm() {
    this.alertController.create({
      header: 'Alert!',
      subHeader: 'Do you want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Exit',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
}
