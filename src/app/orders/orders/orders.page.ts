import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  allOrders: any = [];
  isFirstTime:boolean;
  emptyData:boolean;
  offset: number = 0;
  limit:number = 0;
  isActive:boolean = true;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    private navController: NavController,
    public modalController: ModalController,
    public sharedService: SharedService,
    public loader: LoadingController,
    public alertController: AlertController,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {

    if (this.route.snapshot.params.id) {
     this.isActive = false;
     this.limit = 10;
    }else{
      this.limit = 100000;
    }
    this.getOrders();
  }

  backHandler() {
    if(this.isActive){
      this.navController.navigateBack(['../dashboard']);
    }else{
      this.navController.navigateBack(['../profile']);
    }
   
  }

  getOrders(event?: any, fresh?:any) {

    let details = {
      offset: this.offset,
      limit: this.limit,
      is_active: this.isActive,
    };

    this.sharedService.getOrdersAll(details).then((data) => {
     let serverData = data['data'];
      if(data['data'].length > 0){
        if(fresh){
          this.allOrders=serverData;
        }else{
          this.allOrders.push(...serverData);
        }
        
      }else if(this.offset == 0 && data['data'].length == 0){
        
        this.emptyData = true;
      }
      
      this.isFirstTime = true;
      event && event.target.complete();
      //console.log(this.allOrders);
    });
  }

  showOrder(id) {
    this.navController.navigateForward(['/order-details', id, this.isActive]);
  }

  isCancelShow(order?: any) {
    let timeStart = new Date(order.createdOn).getTime();
    let timeEnd = new Date().getTime();
    let hourDiff = timeEnd - timeStart; //in ms
    let minDiff = hourDiff / 60 / 1000; //in minutes
    let hDiff = hourDiff / 3600 / 1000; //in hours
    let hours = Math.floor(hDiff);
    let minutes = minDiff - 60 * hours;

    if (hours == 0 && minutes <= 2) {
      return true;
    }
    return false;
  }

  async presentAlertConfirm(order) {
    if (this.isCancelShow(order)) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirm!',
        subHeader: 'Are you sure want to cancel this order?',
        message: '',

        inputs: [
          {
            name: 'cancelReason',
            type: 'text',
            placeholder: 'Please enter reason',
          }],
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
            handler: (blah) => {
              //console.log('Confirm Cancel: blah');
            },
          },
          {
            text: 'Cancel Order',
            cssClass: 'secondary',
            handler: (data) => {

              if (!data.cancelReason) {
                alert.message = "Please enter cancellation reason";
                return false;
            } else {
              //console.log(data.cancelReason, "cancelReason")
                this.cancelOrder(order, data.cancelReason);
            }


              
            },
          },
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Sorry!',
        subHeader: 'Order will cancelled only within 2 minutes...',
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
            handler: (blah) => {
              //console.log('Confirm Cancel: blah');
            },
          },
        ],
      });
      await alert.present();
    }
  }



  cancelOrder(order?: any, cancelReason?:any) {
    //console.log(order, cancelReason);
    this.getCancelledOrder(order, cancelReason)
    
  }

  loadData(event) {
    //console.log(event)
    this.limit = 10;
    this.offset = this.allOrders.length;
    this.getOrders(event);
  }

  doRefresh(event) {
    this.offset = 0;
    this.limit = this.allOrders.length;
    //console.log('Begin async operation');
    this.getOrders(event, 'refress');
  }

  toCall(number){
    window.open(`tel:` + number, '_system');
  }

  async getCancelledOrder(orderId, cancel_reason){
    let details = {
      orderId: orderId.id,
      cancel_reason: cancel_reason,
    };

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {

    this.sharedService.getCancelledOrder(details).then((data) => {
      this.getOrders(null, true);
      loading.dismiss();
    });
  });
  }
}
