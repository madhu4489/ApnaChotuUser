import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';
import { LocationPage } from '../location/location.page';
import { SignupUserComponent } from '../profile/signup-user/signup-user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  chooseLocation: string = 'Unnamed Road, Sangareddy';
  slideOpts = {
    speed: 400,
    loop: 'true',
    autoplay: {
      delay: 5000,
    },
  };

  offers: any = [];
  order: any = [];
  allOrders: any = [];
  announcements:any = [];

  orderStatusText: string;

  isEnabled: boolean;

  key:boolean;

  constructor(
    public sharedService: SharedService,
    public modalController: ModalController,
    private navController: NavController,
    public loader: LoadingController,
    public alertController: AlertController,

  ) {


  }

  ngOnInit() {
    this.getlocationsFn();
    this.getOffers();
    this.getAllAnnouncements();
  }

  showExitConfirm() {
    this.alertController.create({
      header: 'Oops!!',
      subHeader: 'Do you want to close the app?',
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


  ionViewWillEnter() {
    //console.log('ionViewWillEnter');

    if (localStorage.getItem('selectedLocation')) {
      let address = JSON.parse(localStorage.getItem('selectedLocation'));
      this.chooseLocation =
        (address.address_name || address.address_type) +
        ', ' +
        address.locality;
    }else{
      this.chooseLocation = 'Unnamed Road, Sangareddy';
    }

    if (localStorage.getItem('jwt') && localStorage.getItem('userDetails')) {
      this.isEnabled = true;
      this.getOrders();
    } else {
      this.isEnabled = false;
    }
  }

  getlocationsFn() {
    this.sharedService.getLocations().then((data) => {
      let serverData = data['data'];
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }
      localStorage.setItem('deliveryLocations', JSON.stringify(serverData));
    });
  }

  profileHandler() {
    if (localStorage.getItem('userDetails')) {
      this.navController.navigateForward(['/profile']);
    } else {
      this.openAddLocation();
    }
  }

  async openAddLocation(isFromPage?: any) {
    const modalRef = await this.modalController.create({
      component: SignupUserComponent,
      cssClass: 'myLoginPopup',
      backdropDismiss: true,
      componentProps: { isFromPage: isFromPage },
    });
    await modalRef.present();
    modalRef.onDidDismiss().then((res: any) => {
      //console.log('closedddd', res);
      if (localStorage.getItem('jwt')) {
        this.isEnabled = true;
        this.key = true;
        this.gotoLocationFn();
      } else {
        this.isEnabled = false;
      }
    });
  }

  gotoLocation() {
    if (localStorage.getItem('userDetails')) {
      // this.navController.navigateForward(['/location']);
      this.gotoLocationFn();
    } else {
      this.openAddLocation('location');
    }
  }

  orders() {
    this.navController.navigateForward(['/orders', '']);
  }

  call() {
    window.open(`tel:` + '9150915084', '_system');
  }

  async getOrders() {
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      let details = {
        offset: 0,
        limit: 250,
        is_active: 1,
      };

      this.sharedService.getOrdersAll(details).then((data) => {
        loading.dismiss();
        let serverData = data['data'];
        if (serverData) {
          this.allOrders = serverData;
        }
      }),
        (error) => {
          loading.dismiss();
        };
    });
  }

  async getOffers() {

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.getDashboardOffers().then((data) => {
        loading.dismiss();
        this.offers = data['data'];
      }),
        (error) => {
          loading.dismiss();
          alert(error.message);
        };
    })

    
  }

  async getAllAnnouncements() {

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.getAllAnnouncements().then((data) => {
        loading.dismiss();
        this.announcements = data['data'];
      }),
        (error) => {
          loading.dismiss();
          alert(error.message);
        };
    })

    
  }


 

  getPager(slides) {
    if(slides.length > 2){
      return true;
    }
    return "false";
  }

  async gotoLocationFn() {

    const modalRef = await this.modalController.create({
      component: LocationPage,
      backdropDismiss: true,
    });
  
    modalRef.onDidDismiss().then((res: any) => {
      console.log(res.data,"resssss");
        if(this.key){
          this.getOrders();
          this.key = false;
        }
      if(res.data){
        let address = JSON.parse(localStorage.getItem('selectedLocation'));
      this.chooseLocation =
        (address.address_name || address.address_type) +
        ', ' +
        address.locality;
      }
      
    });
    await modalRef.present();

  }
}

// slideOpts = {
//   speed: 400,
//   loop: 'true',
// };

// autoplay: {
//   delay: 5000,
// },
