import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../providers/shared.service';

import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  restaurants: any =[];
  offset:number = 0;
  
  constructor(private navController:NavController, public sharedService: SharedService) { }

  ngOnInit() {
    this.getRestaurants();
  }

  backHandler(){
    this.navController.navigateBack(['/dashboard']);
  }
 
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }


  

  getRestaurants(event?:any) {

    console.log(this.offset, "this.offset")
    let vendorData:any = {
      "offset":this.offset,
      "limit":10,
      "category":1
    }
    this.sharedService.getRestaurants(vendorData).then((data) => {
      console.log(data, 'getRestaurants');
      let serverData = data.data;
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }
      if (serverData) {
        this.restaurants.push(...serverData);

        console.log(this.restaurants);
        event && event.target.complete();
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


  // ionViewWillEnter() {
  //   setTimeout(() => {
  //     this.restaurants = {
  //       'heading': 'Normal text',
  //       'para1': 'Lorem ipsum dolor sit amet, consectetur',
  //       'para2': 'adipiscing elit.'
  //     };
  //   }, 5000);
  // }
}
