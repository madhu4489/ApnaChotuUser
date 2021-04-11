import { Component, OnInit } from '@angular/core';
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
    initialSlide: 1,
    speed: 400,
    autoplay: 3000,
    loop: 'true',
  };

  order: any = [];
  allOrders: any = [];

  orderStatusText:string;

  constructor(
    public sharedService: SharedService,
    public modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getlocationsFn();
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

    this.getOrders();
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
}
