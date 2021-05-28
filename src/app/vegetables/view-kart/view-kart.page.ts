import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { SignupUserComponent } from 'src/app/profile/signup-user/signup-user.component';
import { OrderServicesProvider } from 'src/app/providers/order-services/order-services';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'view-kart',
  templateUrl: './view-kart.page.html',
  styleUrls: ['./view-kart.page.scss'],
})
export class ViewKartPage implements OnInit {
  public orderDetails: any = [];
  restaurantDetails: any = [];
  orderMessage: string;
  encodedOrderMessage: string;
  showCount: any = { totalItems: 0, totalPrice: 0, finalPrice: 0 };
  adminDetails: any = [];
  serviceLocation: any;
  serviceLocationId: any;

  isOrderPlaced: boolean = false;
  private vendorOffer: any = [];
  private discountPrice: number = 0;
  private extra_items: any;
  alternate: any;
  deliveryLocation: any = [];

  vendorDetails: any = [];

  isLoading: boolean;
  orderCountDetails: any;

  tipTabel: any = [
    [10, 20, 30, 50]
  ];
  tipAmount: number = 0;

  selectedVendor: any = [];

  payProceed:boolean;

  constructor(
    private navController: NavController,
    private cartDataProvider: OrderServicesProvider,
    public modalController: ModalController,
    public sharedService: SharedService,
    public loader: LoadingController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.getlocationsFn();
    this.selectedVendor = this.cartDataProvider.getVendorDetails();
    console.log("this.selectedVendor:::---------", this.selectedVendor)
  }

  backHandler() {
    this.navController.back();
  }

  getOrderDetails() {
    this.orderDetails = this.cartDataProvider.getCartData();
    this.orderCountDetails = this.cartDataProvider.getOrderDeatils();
    
    console.log(this.orderDetails, ' orderDetails');
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

        console.log(serverData, "serverDataserverData")
        console.log( this.deliveryLocation, " this.deliveryLocation");



        this.serviceLocation =
          serverData &&
          serverData.filter((address) => {
            return (
              address.name === this.deliveryLocation.locality &&
              address.is_active === 1
            );
          });

     

        // this.serviceLocation = this.serviceLocation
        //   ? this.serviceLocation[0]
        //   : [];

        if (this.serviceLocation.length == 0) {
          this.notAvailable();
        } else {
          this.restaurantDetails = this.selectedVendor;
          if (this.restaurantDetails['offer']?.length && this.restaurantDetails['offer'][0].is_active == 1) {
            this.vendorOffer.minOrder = this.restaurantDetails['offer'][0].minOrder;
            this.vendorOffer.offerPercentage = this.restaurantDetails['offer'][0].offerPercentage;
            this.vendorOffer.maxOfferAmount = this.restaurantDetails['offer'][0].maxOfferAmount;
          }

          
          this.serviceLocation = this.serviceLocation[0];

          console.log( this.serviceLocation, " this.serviceLocation");

          
          this.serviceLocation.charge = this.restaurantDetails.is_free_delivery
            ? 0
            : this.serviceLocation.charge;

          this.serviceLocationId = this.serviceLocation.id;
          this.discountPriceFn(this.orderCountDetails?.price);
        }
      } else {
        
      }
      // loading.dismiss();
      localStorage.setItem('deliveryLocations', JSON.stringify(serverData));
    });
  }

  async notAvailable() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Oops!',
      subHeader: `Currently unable to deliver your ${
        this.deliveryLocation.address_type
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
            console.log('Confirm Cancel: blah');
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

 

  gotoDashboard() {
    this.navController.navigateBack(['/dashboard']);
  }
  gotoOrders() {
    this.navController.navigateBack(['/orders', '']);
  }

  addTip(t) {
    if (this.tipAmount === t) {
      this.tipAmount = 0;
      this.showCount.finalPrice = (
        Number(this.showCount.finalPrice) - t
      ).toFixed(0);
    } else {
      this.showCount.finalPrice = (
        Number(this.showCount.finalPrice) -
        this.tipAmount +
        t
      ).toFixed(0);
      this.tipAmount = t;
    }
  }

  recevieOrderFnNew(event, menuItem, type) {

    let findItemIndex = this.orderDetails[
      this.orderDetails.indexOf(menuItem)
    ].items.findIndex((item) => item.type == type);

    if (findItemIndex != -1) {
      menuItem.items[findItemIndex].quantity = event == 1 ? menuItem.items[findItemIndex].quantity + 1 :  menuItem.items[findItemIndex].quantity - 1;
    }

    this.orderDetails[this.orderDetails.indexOf(menuItem)].count =  (menuItem.items.map(item => {
      return item.quantity > 0 && item.quantity
    })).reduce(function(acc, val) { return acc + val; }, 0);


    
    let orderPrice = this.orderDetails[this.orderDetails.indexOf(menuItem)].items.map(element => {
      return element.quantity > 0 && (element.quantity*element.price)
    });

    this.orderDetails[this.orderDetails.indexOf(menuItem)].orderPrice = orderPrice.reduce(function(acc, val) { return acc + val; }, 0);

    this.cartDataProvider.addCartData(this.orderDetails);

    this.orderCountDetails = this.cartDataProvider.getOrderDeatils();
    this.discountPriceFn(this.orderCountDetails.price);
    if(this.orderCountDetails.count == 0){
      this.backHandler()
    }
  }

  filterItemsOfType(type) {
    return type.filter((x) => x.quantity != 0);
  }


  async placeOrder() {
    let vendorId: any;
    let Items: any = [];

    this.orderDetails.forEach((order) => {
      vendorId = order.vendorId;
      order.items.forEach(element => {
        if(element.quantity != 0){
          Items.push({
            itemId: element.itemId,
            quantity: `(${element.type}) X ${element.quantity}`,
            price: element.price*element.quantity,
          });
        }
      });
    });




    let userDetails = JSON.parse(localStorage.getItem('userDetails'));

    let address = `${userDetails.first_name}, ${this.deliveryLocation.h_no}, ${this.deliveryLocation.street},  ${this.deliveryLocation?.landmark && 'landmark: ' + this.deliveryLocation?.landmark }, ${this.deliveryLocation?.locality}, ${this.deliveryLocation?.contact_no}, ${userDetails?.mobile}`;
    let orderData = {
      vendorId: vendorId,
      price:  this.orderCountDetails.price,
      paymentMode: 'cashoronline',
      address: address,
      lat: null,
      lng: null,
      items: Items,
      finalPrice: this.totalToPayPrice(this.orderCountDetails.price, this.serviceLocation?.charge, this.tipAmount, this.discountPrice),
      itemsPrice:  this.orderCountDetails.price,
      deliveryFee: this.serviceLocation
        ? Number(this.serviceLocation.charge)
        : 0,
      locationId: this.serviceLocationId,
      discountPrice: this.discountPrice ? this.discountPrice : 0,
      extra_items: this.extra_items,
      alt_mobile: this.alternate ? this.alternate : '',
      tip: this.tipAmount
    };

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    console.log(orderData, "orderData")

    await loading.present().then(() => {
      this.sharedService.createOrder(orderData).then((data) => {
        console.log(data, 'dataaaaaaaa');
        this.isOrderPlaced = true;
        loading.dismiss();
      });
    });
  }


  totalToPayPrice(a,b,c,d){
    console.log(a,b,c,d)
      return Number(a)+Number(b)+Number(c)-Number(d)
  }


  discountPriceFn(pric){
    this.discountPrice =
      pric >= this.vendorOffer.minOrder
        ? (pric / 100) * parseInt(this.vendorOffer.offerPercentage)
        : null;

    this.discountPrice =
      this.discountPrice &&
      this.discountPrice >= parseInt(this.vendorOffer.maxOfferAmount)
        ? this.vendorOffer.maxOfferAmount
        : this.discountPrice;
    this.discountPrice = Math.round(this.discountPrice) > 0 ? Math.round(this.discountPrice) : 0;
    console.log(pric, "pricpricpricpric", this.vendorOffer)

    console.log(this.discountPrice, "this.discountPrice");
  }

}
