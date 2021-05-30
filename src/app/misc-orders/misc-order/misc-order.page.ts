import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { SignupUserComponent } from 'src/app/profile/signup-user/signup-user.component';

import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-misc-order',
  templateUrl: './misc-order.page.html',
  styleUrls: ['./misc-order.page.scss'],
})
export class MiscOrderPage implements OnInit {
  name: string;
  isOrderPlaced: boolean;
  deliveryLocation: any = [];
  adminDetails: any = [];
  serviceLocation: any;
  serviceLocationId: any;
  items: any;
  pickup: any;

  constructor(
    private navController: NavController,
    public modalController: ModalController,
    public sharedService: SharedService,
    public loader: LoadingController,
    public alertController: AlertController,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.params.name)
    this.getlocationsFn();
    //console.log('dfdfdf', )
   
  }

  ionViewWillEnter() {
    if(localStorage.getItem("misc-order")){
      this.items =   JSON.parse(localStorage.getItem("misc-order"))
    }
    
    if(localStorage.getItem("pickup")){
      this.pickup =   JSON.parse(localStorage.getItem("pickup"))
    }
    
    //console.log('ionViewWillEnter');
  }
  

  backHandler() {
    this.navController.navigateBack(['../dashboard']);
    localStorage.setItem("misc-order","");
    localStorage.setItem("pickup", "");
  }

  addAddress() {

    localStorage.setItem("misc-order", JSON.stringify(this.items));
    localStorage.setItem("pickup", JSON.stringify(this.pickup));
    
    if (localStorage.getItem('userDetails')) {
      this.navController.navigateBack(['/location']);
    } else {
      this.openAddLocation('location');
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

    modalRef.onDidDismiss().then((res: any) => {

      if(localStorage.getItem("misc-order")){
      this.items =   JSON.parse(localStorage.getItem("misc-order"))
      }

      if(localStorage.getItem("pickup")){
        this.pickup =   JSON.parse(localStorage.getItem("pickup"))
      }

        //console.log('local',  this.items)
    })
  }

  async getlocationsFn() {
    this.sharedService.getLocations().then((data) => {
      let serverData = data['data'];
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }

      if (localStorage.getItem('selectedLocation')) {
        this.deliveryLocation = JSON.parse(
          localStorage.getItem('selectedLocation')
        );
        this.serviceLocation =
          serverData &&
          serverData.filter((address) => {
            return (
              address.name === this.deliveryLocation.locality &&
              address.is_active === 1
            );
          });
        this.serviceLocation = this.serviceLocation
          ? this.serviceLocation[0]
          : [];

        if (this.serviceLocation && this.serviceLocation.is_active != 1) {
          this.notAvailable();
        } else {
          this.serviceLocationId = this.serviceLocation.id;
        }
      }
      localStorage.setItem('deliveryLocations', JSON.stringify(serverData));
    });
  }

  async notAvailable() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Oops!',
      subHeader: `Currently unable to deliver your ${
        this.serviceLocation && this.serviceLocation.name
      } location.`,
      buttons: [
        {
          text: 'Okey',
          handler: () => {
            //console.log('Confirm Okay');
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      subHeader: 'Are you sure want to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',

          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Proceed',
          cssClass: 'secondary',
          handler: () => {
            this.placeOrder();
          },
        },
      ],
    });

    await alert.present();
  }

  async placeOrder() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let address = `${userDetails.first_name}, ${this.deliveryLocation.h_no}, ${this.deliveryLocation.street}, landmark: ${this.deliveryLocation.landmark}, ${this.deliveryLocation.locality}, ${this.deliveryLocation.contact_no}, ${userDetails.mobile}`;

    let orderData = {
      discountPrice: '0',
      deliveryFee: this.serviceLocation
        ? Number(this.serviceLocation.charge)
        : 0,
      paymentMode: 'cashoronline',
      locationId: this.serviceLocationId,
      address: address,
      lat: null,
      lng: null,
      items_data: `ITEMS: ${this.items}!! <PICKUP STORE>: ${
        this.pickup ? this.pickup : 'Apna chotu'
      }`,
      alt_mobile: this.deliveryLocation.contact_no
        ? this.deliveryLocation.contact_no
        : userDetails.mobile,
    };


    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.createMiscOrder(orderData).then((data) => {
        //console.log(data, 'dataaaaaaaa');
        this.isOrderPlaced = true;
        loading.dismiss();
        localStorage.removeItem("misc-order");
        localStorage.removeItem("pickup");
      });
    });
  }

  gotoOrders() {
    this.navController.navigateBack(['/orders', '']);
  }

  gotoDashboard() {
    this.navController.navigateBack(['/dashboard']);
  }
}
