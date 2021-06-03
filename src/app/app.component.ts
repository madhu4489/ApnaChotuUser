import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';


// import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { FCM } from '@ionic-native/fcm/ngx';

import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { SharedService } from './providers/shared.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList < IonRouterOutlet > ;

  public subscription: any;

  constructor(private navController: NavController, private network: Network,
    private platform: Platform,
    private firebaseX: FirebaseX,
    public sharedService: SharedService,
    public alertController: AlertController,
    private router: Router

   ) {
    // private fcm: FCM
      this.initializeApp();

      this.backButtonEvent();
    }

  ngOnInit() {
    this.network.onDisconnect().subscribe(() => {
      //console.log('network was disconnected :-(');
      this.navController.navigateRoot(['./no-connection']);
    });
  }

  // ionViewDidEnter() {
  //   this.backButtonEvent();
  
  // }


  // ionViewWillLeave() {
  //   this.subscription.unsubscribe();
  // }


 
  initializeApp() {

    this.platform.ready().then(() => {

  
      this.platform.backButton.subscribeWithPriority(-1, () => {


        console.log('this.routerOutlet', this.routerOutlet)
        // if (!this.routerOutlet.canGoBack()) {
        //   this.showExitConfirm();
        // }

      });


      localStorage.setItem("deviceId", "2qwaskjbdf67t67d")

      this.firebaseX.getToken()
        .then(token =>{
          //console.log(token, "token ID getToken");
          if(token){
            localStorage.setItem("deviceToken", JSON.stringify(token))
          }
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error('Error getting token', error));

    this.firebaseX.onMessageReceived()
      .subscribe(data => {
        
        if(data.tap == "background"){
          //console.log(`User Tapped a notification ${JSON.stringify(data)}`);
          
          this.navController.navigateForward(['/orders', '']);
          
        }else{

          if (localStorage.getItem('userDetails')) {
            //console.log(`Open APP notification ${JSON.stringify(data)}`)
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
          //console.log(`onTokenRefresh ${JSON.stringify(token)}`)
          localStorage.setItem("deviceToken", JSON.stringify(token))
        }
      })



    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {


      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {

        console.log(this.router.url, "this.router.urlthis.router.url");

        console.log(outlet, "outlet:::::");
        
        if (outlet && outlet.canGoBack()) {
          outlet.pop();

        } else if (this.router.url === '/dashboard') {
          this.showExitConfirm(); 
        }
      });
    });
  }



  showExitConfirm() {
    this.alertController.create({
      header: 'Confirm!!',
      subHeader: 'Are you sure you want to exit the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          //console.log('Application exit prevented!');
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
