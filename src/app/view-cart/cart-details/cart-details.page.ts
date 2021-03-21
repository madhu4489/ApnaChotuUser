import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { SignupUserComponent } from 'src/app/profile/signup-user/signup-user.component';
import { CartDataProvider } from 'src/app/providers/cart-data/cart-data';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.page.html',
  styleUrls: ['./cart-details.page.scss'],
})
export class CartDetailsPage implements OnInit {
  public orderDetails: any = [];
  restaurantDetails: any = [];
  orderMessage: string;
  encodedOrderMessage: string;
  showCount: any = { totalItems: 0, totalPrice: 0, finalPrice: 0 };
  adminDetails: any = [];
  serviceLocation: any;
  serviceLocationId: any;

  isOrderPlaced: boolean;
  private vendorOffer: any = [];
  private discountPrice: number = 0;
  private request: any;
  alternate: any;
  deliveryLocation: any = [];

  isLoading: boolean;

  constructor(
    private navController: NavController,
    private cartDataProvider: CartDataProvider,
    public modalController: ModalController,
    public sharedService: SharedService,
    public loader: LoadingController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.getlocationsFn();
  }

  backHandler() {
    this.navController.back();
  }

  getOrderDetails() {
    this.orderDetails = this.cartDataProvider.getCartData();
  }

  recevieOrderFn(items: any) {
    let idxes;
    if (items.count == 0) {
      this.orderDetails.forEach((element, index) => {
        if (element.name === items.name) {
          this.orderDetails.splice(index, 1);
        }
      });
    } else {
      this.orderDetails.forEach((element, index) => {
        if (element.name === items.name) {
          idxes = index;
        }
      });

      if (idxes || idxes == 0) {
        this.orderDetails[idxes] = items;
      } else {
        this.orderDetails.push(items);
      }

      let num = 0;
      let num1 = 0;
      this.orderDetails.forEach(function (order) {
        if (order.count > 0) {
          num = num + order.count;
        }

        if (order.totalprice > 0) {
          num1 = num1 + order.totalprice;
        }
      });
    }

    this.cartDataProvider.setCartData(this.orderDetails);
    this.cartDataProvider.removeCartItems();
    this.orderDetails = this.cartDataProvider.getCartData();
    console.log(this.orderDetails, 'this.orderDetails::::');
    this.buildWhatsappMessage();
    if (this.orderDetails.length == 0) {
      this.navController.back();
    }
  }

  addAddress() {
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
  }

  gotoLocation() {}

  async getlocationsFn() {
    this.isLoading = false;
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    //   await loading.present().then(() => {

    // });

    this.sharedService.getLocations().then((data) => {
      let serverData = data['data'];
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }
      this.getOrderDetails();
      this.isLoading = true;
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
          this.restaurantDetails = this.cartDataProvider.getRestName();
          if (this.restaurantDetails['offer'].length) {
            this.vendorOffer.minOrder = this.restaurantDetails[
              'offer'
            ][0].minOrder;
            this.vendorOffer.offerPercentage = this.restaurantDetails[
              'offer'
            ][0].offerPercentage;
            this.vendorOffer.maxOfferAmount = this.restaurantDetails[
              'offer'
            ][0].maxOfferAmount;
          }
          this.serviceLocation.charge = this.restaurantDetails.is_free_delivery
            ? 0
            : this.serviceLocation.charge;
          this.buildWhatsappMessage();
        }
      }
      // loading.dismiss();
      localStorage.setItem('deliveryLocations', JSON.stringify(serverData));
    });
  }

  async notAvailable() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Oops!',
      message: `Currently unable to deliver your ${
        this.serviceLocation && this.serviceLocation.name
      } location.`,
      buttons: [
        {
          text: 'Okey',
          handler: () => {
            console.log('Confirm Okay');
          },
        },
      ],
    });
    await alert.present();
  }

  buildWhatsappMessage() {
    this.orderMessage = '';
    // this.orderMessage = this.restaurantName + "\n";
    let totao: number = 0;
    let pric: number = 0;

    console.log(this.orderDetails, ' this.orderDetails');
    this.orderDetails.forEach((order) => {
      totao = totao + order.count;
      pric = pric + order.totalprice;

      this.orderMessage += '\n';
      this.orderMessage +=
        'Item: ' +
        order.name +
        '\n' +
        'Qty: ' +
        order.count +
        '\n' +
        'Price: Rs.' +
        order.totalprice +
        '\n';
      this.orderMessage += '...................' + '\n';
    });

    console.log(totao, 'thispricpricpric', pric);

    this.showCount.totalItems = totao;
    this.showCount.totalPrice = pric;

    console.log(this.showCount, 'this.showCountthis.showCount');
    this.discountPrice =
      pric >= this.vendorOffer.minOrder
        ? (pric / 100) * parseInt(this.vendorOffer.offerPercentage)
        : null;
    this.discountPrice =
      this.discountPrice &&
      this.discountPrice >= parseInt(this.vendorOffer.maxOfferAmount)
        ? this.vendorOffer.maxOfferAmount
        : this.discountPrice;
    this.discountPrice = Math.round(this.discountPrice);
    this.showCount.finalPrice = (
      this.showCount.totalPrice -
      this.discountPrice +
      Number(this.serviceLocation.charge)
    ).toFixed(0);
    this.encodedOrderMessage = encodeURI(this.orderMessage);
  }
}
