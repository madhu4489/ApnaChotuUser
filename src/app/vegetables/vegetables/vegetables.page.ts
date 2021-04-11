import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

import { IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/providers/shared.service';
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

  constructor(
    private navController: NavController,
    public sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getvegVendors();
  }

  backHandler() {
    this.navController.back();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  getvegVendors(event?: any) {
    console.log(this.offset, 'this.offset');
    let vendorData: any = {
      offset: this.offset,
      limit: 10,
      category: 1,
      is_active: 1,
    };
    this.sharedService.getRestaurants(vendorData).then((data) => {
      console.log(data, 'getvegVendors');
      let serverData = data.data;
      if (serverData) {
        this.vegVendors.push(...serverData);

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
    this.offset = this.vegVendors.length;
    this.getvegVendors(event);
  }

  showVendor(id) {
    this.navController.navigateForward(['vendor-details', id]);
  }
}
