import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';
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
  };

  // autoplay: {
  //   delay: 5000,
  // },

  offers: any = [];
  order: any = [];
  allOrders: any = [];

  orderStatusText: string;

  isEnabled: boolean;

  constructor(
    public sharedService: SharedService,
    public modalController: ModalController,
    private navController: NavController,
    private network: Network
  ) {}

  ngOnInit() {
    this.getlocationsFn();
    this.getOffers();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');

    if (localStorage.getItem('selectedLocation')) {
      let address = JSON.parse(localStorage.getItem('selectedLocation'));
      this.chooseLocation =
        (address.address_name || address.address_type) +
        ', ' +
        address.locality;
    }

    if (localStorage.getItem('jwt')) {
      this.isEnabled = true;
      this.getOrders();
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
      backdropDismiss: false,
      componentProps: { isFromPage: isFromPage },
    });
    await modalRef.present();
  }

  gotoLocation() {
    if (localStorage.getItem('userDetails')) {
      this.navController.navigateForward(['/location']);
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

  getOrders() {
    let details = {
      offset: 0,
      limit: 250,
      is_active: 1,
    };

    this.sharedService.getOrdersAll(details).then((data) => {
      let serverData = data['data'];
      if (serverData) {
        this.allOrders = serverData;
        console.log('allOrdersallOrdersallOrders', serverData, this.allOrders);
      }
    });
  }

  getOffers() {
    this.sharedService.getDashboardOffers().then((data) => {
      console.log(data['data'], "data['data']");
      this.offers = data['data'];
    }),
      (error) => {
        alert(error.message);
      };
  }

  slideOptions(slides) {
    let slideOpts = {
        speed: 400,
        loop: 'true',
      };

      let slideOpts1 = {
        speed: 400,
        loop: 'false',
      };

      console.log(slides.length, "slides.length")
    // if(slides.length > 2){
    //   return slideOpts;
    // }
    return slideOpts
  }


  getPager(slides){
    return false
  }
}



// slideOpts = {
//   speed: 400,
//   loop: 'true',
// };

// autoplay: {
//   delay: 5000,
// },