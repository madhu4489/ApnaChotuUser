import { Component, Input, OnInit } from '@angular/core';

import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-remove-items',
  templateUrl: './remove-items.component.html',
  styleUrls: ['./remove-items.component.scss'],
})
export class RemoveItemsComponent implements OnInit {
  @Input() selectedItems = null;

  priceCount: any = [];

  private counterItems:any =[];

  constructor(
    public navController: NavController,
    private _modalCtrl: ModalController,
    public sharedService: SharedService,
    public loader: LoadingController
  ) {}

  ngOnInit() {
   

    console.log(this.selectedItems, "selectedItemsselectedItems")
    // this.selectedItems.items.filter((item) => {
    //   console.log(item, this.selectedItems.defaultVariantDetails);

    //   if (
    //     this.selectedItems.defaultVariantDetails.quantity == item.type &&
    //     item.quantity == 0
    //   ) {
    //     item.quantity = 1;
    //   }
    // });
  }

  backHandler() {
    this._modalCtrl.dismiss();
    // this.navController.navigateBack(['../dashboard']);
  }

  recevieOrderFn(event) {

    let findItemIndex =  this.counterItems.findIndex(
      (item) => item.type == event.type
    );
    if (findItemIndex != -1) {
      this.counterItems[findItemIndex] = event;
    } else {
     this.counterItems.push(event);
    }
  }

  removeOrderFn(event) {

    let findItemIndex = this.counterItems.findIndex(
      (item) => item.type == event.type
    );
    if (findItemIndex != -1) {
     this.counterItems[findItemIndex] = event;
    } else {
   this.counterItems.push(event);
    }
  }

  // this._modalCtrl.dismiss();

  submitForm() {
    console.log(this.counterItems, "this.counterItemsthis.counterItems");

    if(this.counterItems){
     
      this.selectedItems.items.forEach(item => {
        this.counterItems.forEach(element => {
          if(item.type == element.type){
           item.quantity = element.quantity;
          }
        });
      });

      this.selectedItems.count =  (this.selectedItems.items.map(item => {
        return item.quantity > 0 && item.quantity
      })).reduce(function(acc, val) { return acc + val; }, 0);
  
      let orderPrice = this.selectedItems.items.map(element => {
        return element.quantity > 0 && (element.quantity*element.price)
      });
  
      this.selectedItems.orderPrice = orderPrice.reduce(function(acc, val) { return acc + val; }, 0);
      
      this._modalCtrl.dismiss(this.selectedItems);
    }

    
  }

  isDisabled() {
    return false;
  }
}
