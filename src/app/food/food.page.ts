import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../providers/shared.service';

import { IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';

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

  constructor(
    private navController: NavController,
    public sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRestaurants();
  }

  backHandler() {
    this.navController.back();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  getRestaurants(event?: any) {
    console.log(this.offset, 'this.offset');
    let vendorData: any = {
      offset: this.offset,
      limit: 10,
      category: 1,
      is_active:1
    };
    this.sharedService.getRestaurants(vendorData).then((data) => {
      console.log(data, 'getRestaurants');
      let serverData = data.data;
      if (serverData) {
        this.restaurants.push(...serverData);

        event && event.target.complete();
        if (!serverData) {
          this.isClear = true;
        }
      } else {
        event.target.disabled = true;

        this.sharedService.presentToastWithOptions(
          serverData.message,
          'warning'
        );
      }
    });
  }

  loadData(event) {
    this.offset = this.restaurants.length;
    this.getRestaurants(event);
  }

  showVendor(id) {
    this.navController.navigateForward(["vendor", id]);
  }

  
}
