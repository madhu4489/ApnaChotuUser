import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
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



}
