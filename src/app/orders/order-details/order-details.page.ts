import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  details: any = [];
  vendor:any = [];
  status:any=[];
  isFirstTime:boolean;
  isnotpast:boolean;
  orderID:any;

  constructor(
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private navController: NavController,
    public loader: LoadingController,
    public alertController: AlertController
  ) {
    if (this.route.snapshot.params.id) {
      this.orderID = this.route.snapshot.params.id;
      this.getOrders();
    }


    console.log(typeof this.route.snapshot.params.past, "past")
    if(this.route.snapshot.params.past === 'true'){
      this.isnotpast = true;
    }
  }

  ngOnInit() {}
    backHandler() {
      if(this.isnotpast){
        this.navController.navigateBack(['../orders', '']);
      }else{
        this.navController.navigateBack(['../orders', 'past']);
      }
    }



  getOrders(event?:any){
    this.sharedService
    .getSingleOrderDetails( this.orderID)
    .then((data) => {
      this.isFirstTime = true;
      if (data) {
        this.details = data.data;
        this.vendor = this.details.vendor;
        this.status = this.details.status;
      }
      event && event.target.complete();
      console.log(this.details);
    });
  }


  doRefresh(event) {

    console.log('Begin async operation');
    this.getOrders(event);
  }

  // reOrder(details){

  //   console.log(details, "details")

  // }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      subHeader: 'Are you sure want to Order?',
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
        }
      ],
    });

    await alert.present();
  }

  async placeOrder() {

    console.log(this.details, "this.details")
    // let vendorId: any;
    // let Items: any = [];

    // this.details.forEach((element) => {
    //   vendorId = element.vendorId;
    //   Items.push({
    //     itemId: element.itemId,
    //     quantity: element.count,
    //     price: element.price,
    //   });
    // });

    // let userDetails = JSON.parse(localStorage.getItem('userDetails'));

    // let address = details;
    // let orderData = {
    //   vendorId: this.details.vendorId,
    //   price: this.details.totalPrice,
    //   paymentMode: 'cashoronline',
    //   address: this.details.address,
    //   lat: null,
    //   lng: null,
    //   items: this.details.items,
    //   finalPrice: this.details.finalPrice,
    //   itemsPrice: this.details.totalPrice,
    //   deliveryFee: this.details,
    //   locationId: this.serviceLocationId,
    //   discountPrice: this.discountPrice ? this.discountPrice : 0,
    //   extra_items: this.extra_items,
    //   alt_mobile: this.alternate ? this.alternate : '',
    // };

    // const loading = await this.loader.create({
    //   cssClass: 'my-custom-class',
    //   message: 'Please wait...',
    // });
    // await loading.present().then(() => {
    //   this.sharedService.createOrder(orderData).then((data) => {
    //     console.log(data, 'dataaaaaaaa');
    //     loading.dismiss();
    //   });
    // });
  }

}
