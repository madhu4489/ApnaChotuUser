import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { LocationPage } from 'src/app/location/location.page';
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

  isOrderPlaced: boolean = false;
  private vendorOffer: any = [];
  private discountPrice: number = 0;
  private extra_items: any;
  alternate: any;
  deliveryLocation: any = [];

  vendorDetails:any =[];

  isLoading: boolean;

  tipTabel: any = [
    [10, 20, 30, 50]
  ];
  tipAmount: number = 0;

  userDetails:any = [];
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
    this.vendorDetails = this.cartDataProvider.getRestName();
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
  }

  backHandler() {
    this.navController.back();
  }

  getOrderDetails() {
    this.orderDetails = this.cartDataProvider.getCartData();
    //console.log(this.orderDetails, ' orderDetails');
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
    this.buildWhatsappMessage();
    if (this.orderDetails.length == 0) {
      this.navController.back();
    }
  }

  addAddress() {
    if (localStorage.getItem('userDetails')) {
      // this.navController.navigateBack(['/location']);
      this.gotoLocationPage()
    } else {
      this.openAddLocation('location');
    }
  }

  async openAddLocation(isFromPage?: any) {
    const modalRef = await this.modalController.create({
      component: SignupUserComponent,
      cssClass: 'myLoginPopup',
      backdropDismiss: true,
      componentProps: { isFromPage: isFromPage },
    });

    modalRef.onDidDismiss().then((res: any) => {
      console.log(res.data,"resssss");
  
      if(res.data){
        this.gotoLocationPage()
      }
      
    });


    await modalRef.present();
  }



  async getlocationsFn(key?:any) {
    if(!key){
      this.isLoading = false;
    }
    

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


        // this.serviceLocation = this.serviceLocation
        //   ? this.serviceLocation[0]
        //   : [];

         

        if (this.serviceLocation?.length == 0) {
          this.notAvailable();
        } else {
          this.restaurantDetails = this.cartDataProvider.getRestName();
          this.serviceLocation = this.serviceLocation[0];

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
     
        //   ? this.serviceLocation[0]
          this.serviceLocation.charge = this.restaurantDetails.is_free_delivery
            ? 0
            : this.serviceLocation.charge;

          this.serviceLocationId = this.serviceLocation.id;
          this.buildWhatsappMessage();
        }
      } else {
        this.buildWhatsappMessage();
      }
      // loading.dismiss();
      localStorage.setItem('deliveryLocations', JSON.stringify(serverData));
    });
  }

  async notAvailable() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sorry for the inconvenience!',
      subHeader: `Currently, Our Service is unavailable to your ${this.deliveryLocation.address_type} location address.`,
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

  buildWhatsappMessage() {
    this.orderMessage = '';
    let totao: number = 0;
    let pric: number = 0;

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
        'Price: ₹' +
        order.totalprice +
        '\n';
      this.orderMessage += '...................' + '\n';
    });

    this.showCount.totalItems = totao;
    this.showCount.totalPrice = pric;

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

    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));

    this.showCount.finalPrice = (
      this.showCount.totalPrice -
      this.discountPrice + this.tipAmount +
      (this.serviceLocation && !this.vendorDetails.is_free_delivery && this.userDetails?.prime_customer == 0 ? Number(this.serviceLocation.charge) : 0) 
    ).toFixed(0);

    console.log(this.userDetails?.prime_customer, "this.userDetails?.prime_customer")

    this.encodedOrderMessage = encodeURI(this.orderMessage);
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
        }
      ],
    });

    await alert.present();
  }

  async placeOrder() {
    let vendorId: any;
    let Items: any = [];

    this.orderDetails.forEach((element) => {
      vendorId = element.vendorId;
      Items.push({
        itemId: element.itemId,
        quantity: element.count,
        price: element.price,
      });
    });

    let userDetails = this.userDetails;



    let address = `${userDetails.first_name}, ${this.deliveryLocation.h_no}, ${this.deliveryLocation.street}, landmark: ${this.deliveryLocation.landmark}, ${this.deliveryLocation.locality}, ${this.deliveryLocation.contact_no}, ${userDetails.mobile}`;
    let orderData = {
      vendorId: vendorId,
      price: this.showCount.totalPrice,
      paymentMode: 'cashoronline',
      address: address,
      lat: null,
      lng: null,
      items: Items,
      finalPrice: this.showCount.finalPrice,
      itemsPrice: this.showCount.totalPrice,
      deliveryFee: userDetails?.prime_customer == 1 ? 0 : this.serviceLocation
        ? Number(this.serviceLocation.charge)
        : 0,
      locationId: this.serviceLocationId,
      discountPrice: this.discountPrice ? this.discountPrice : 0,
      extra_items: this.extra_items,
      alt_mobile: this.alternate ? this.alternate : '',
    };

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.createOrder(orderData).then((data) => {
        //console.log(data, 'dataaaaaaaa');
        this.isOrderPlaced = true;
        loading.dismiss();
      });
    });
  }

  gotoDashboard() {
    this.navController.navigateBack(['/dashboard']);
  }
  gotoOrders() {
    this.navController.navigateBack(['/orders', '']);
  }

  addTip(t) {
    if(this.tipAmount === t){
      this.tipAmount =  0;
      this.showCount.finalPrice = (Number(this.showCount.finalPrice) - t ).toFixed(0);
    }else{
      this.showCount.finalPrice = (Number(this.showCount.finalPrice) - this.tipAmount + t  ).toFixed(0);
      this.tipAmount = t;

    }
  }


  async gotoLocationPage() {

    const modalRef = await this.modalController.create({
      component: LocationPage,
      backdropDismiss: true,
    });
  
    modalRef.onDidDismiss().then((res: any) => {
      console.log(res.data,"resssss");
  
      if(res.data){
        this.getlocationsFn(true);
      }
      
    });
    await modalRef.present();

  }

  
}
