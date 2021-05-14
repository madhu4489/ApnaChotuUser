import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/providers/shared.service';
import { OrderServicesProvider } from 'src/app/providers/order-services/order-services';
@Component({
  selector: 'app-vegetables',
  templateUrl: './vegetables.page.html',
  styleUrls: ['./vegetables.page.scss'],
})
export class VegetablesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  vegVendors: any = [];
  offset: number = 0;
  isClear: boolean;
  terms: string;
  noStores:boolean;
  catagorieId:any;


  isActicveFirst = true;
  dontDo = false;

  closedVendorCount = false;

  noActiveRestarents:boolean;

  constructor(
    private navController: NavController,
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public orderServicesProvider: OrderServicesProvider,
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.catagorieId = this.route.snapshot.params.id;
      this.getvegVendors();
    }
    this.orderServicesProvider.clearCartData()
  }

  backHandler() {
    this.navController.navigateRoot(['dashboard']);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  getvegVendors(event?: any) {
    console.log(this.offset, 'this.offset');
    let vendorData: any = {
      offset: this.offset,
      limit: 10,
      category: this.catagorieId,
      is_open:true
    };
    this.sharedService.getRestaurants(vendorData).then((data) => {
      console.log(data.closeCount == 0 && data.openCount == 0, 'getvegVendors');
      let serverData = data.data;

      if(data.closeCount == 0 && data.openCount == 0 || serverData.length == 0){
        this.noStores = true;
       
      }


      if (serverData.length == 10) {
        this.vegVendors.push(...serverData);

        event && event.target.complete();
        if (!serverData) {
          this.isClear = true;
        }
      } else  {
        this.vegVendors.push(...serverData);
        this.noActiveRestarents = true;
        this.isActicveFirst = false;
        event && event.target.complete();
        this.offset = 0;
        this.vegVendors.push({id:'closed', name:'Stores Closed Today ', address:'null'});
        this.inActiveGetRestaurants();
        console.log(serverData, 'no rest');
      }
    });
  }

  loadData(event) {
    if(!this.dontDo){
      if(!this.noActiveRestarents){
        this.offset = this.vegVendors.length;
        this.getvegVendors(event);
      }else{
      
        this.inActiveGetRestaurants(event)
      }
    }else{
      event && event.target.complete();
    }
    
  }
  showVendor(id) {
    this.navController.navigateForward(['vendor-details', id, this.catagorieId]);
  }


  inActiveGetRestaurants(event?: any) {
    let vendorData: any = {
      offset: this.offset,
      limit: 10,
      category:  this.catagorieId,
      is_open:'false'
    };
    this.sharedService.getRestaurants(vendorData).then((data) => {
      let serverData = data.data;
      if (serverData.length > 0) {
        this.closedVendorCount = true;
        this.offset =  this.offset + serverData.length;
        this.vegVendors.push(...serverData);
        event && event.target.complete();
        if (!serverData) {
          this.isClear = true;
        }
      } else {
        event && event.target.complete();
        console.log(serverData, 'no rest');
        this.dontDo = true;
      }

     
    });
  }


}
