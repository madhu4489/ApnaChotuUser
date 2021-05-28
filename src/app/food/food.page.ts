import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../providers/shared.service';

import { IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartDataProvider } from '../providers/cart-data/cart-data';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  restaurants: any = [];
  offset: number = 0;
  isClear: boolean;
  terms: string;

  isActicveFirst = true;
  dontDo = false;

  noActiveRestarents:boolean;
  closedVendorCount:boolean;
  isShowSkelton:boolean;

  constructor(
    private navController: NavController,
    public sharedService: SharedService,
    private router: Router,
    private cartDataProvider: CartDataProvider
  ) {}

  ngOnInit() {
    this.getRestaurants();
    this.cartDataProvider.clearCartData();
  }

  backHandler() {
    this.navController.back();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  getRestaurants(event?: any) {
    let vendorData: any = {
      offset: this.offset,
      limit: 1000,
      category: 1,
      is_open:this.isActicveFirst
    };
    this.sharedService.getRestaurants(vendorData).then((data) => {
      let serverData = data.data;
      console.log(serverData, 'getRestaurants');
      if (serverData) {
        this.restaurants.push(...serverData);
        // event && event.target.complete();
        if (!serverData) {
          this.isClear = true;
        }

        this.noActiveRestarents = true;
        this.isActicveFirst = false;
        this.offset = 0;
        this.restaurants.push({id:'closed', name:'Closed ', address:'null'});
        this.inActiveGetRestaurants();
        console.log(serverData, 'no rest');


      } else {
        this.noActiveRestarents = true;
        this.isActicveFirst = false;
        // event && event.target.complete();
        this.offset = 0;
        this.restaurants.push({id:'closed', name:'Closed ', address:'null'});
        this.inActiveGetRestaurants();
        console.log(serverData, 'no rest');
      }
    });
  }

  inActiveGetRestaurants(event?: any) {
    let vendorData: any = {
      offset: this.offset,
      limit: 1000,
      category: 1,
      is_open:'false'
    };
    this.sharedService.getRestaurants(vendorData).then((data) => {
      let serverData = data.data;
      
      if (serverData.length > 0) {
        this.closedVendorCount = true;
        this.offset =  this.offset + serverData.length;
        this.restaurants.push(...serverData);
        event && event.target.complete();
        if (!serverData) {
          this.isClear = true;
        }

      
      } else {
        event && event.target.complete();
        console.log(serverData, 'no rest');
        this.dontDo = true;
      }

      this.isShowSkelton = true;
    });
  }

  loadData(event) {
    if(!this.dontDo){
      if(!this.noActiveRestarents){
        this.offset = this.restaurants.length;
        this.getRestaurants(event);
      }else{
      
        this.inActiveGetRestaurants(event)
      }
    }else{
      event && event.target.complete();
    }
    
  }

  showVendor(id) {
    this.cartDataProvider.clearCartData();
    console.log(this.cartDataProvider.getCartData(), "order itemssssssssss")
    this.navController.navigateForward(["vendor", id]);
  }

  
}
