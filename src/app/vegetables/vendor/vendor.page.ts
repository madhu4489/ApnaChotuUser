import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { CartDataProvider } from 'src/app/providers/cart-data/cart-data';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.page.html',
  styleUrls: ['./vendor.page.scss'],
})
export class VendorPage implements OnInit {
  constructor(private navController: NavController,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public loader: LoadingController,
    public actionSheetController: ActionSheetController) {}

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.getRestaurantVendor(this.route.snapshot.params.id);
    }
  }

  backHandler(){
    this.navController.navigateForward(["vegetables"]);
  }
  async getRestaurantVendor(id?: any) {
    this.sharedService.getRestaurantVendor(id).then((resp) => {
      console.log(resp);
    });
  }
}
