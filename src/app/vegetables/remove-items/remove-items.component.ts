import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
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

  constructor(
    public navController: NavController,
    private _modalCtrl: ModalController,
    public sharedService: SharedService,
    public loader: LoadingController
  ) {}

  ngOnInit() {
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

  recevieOrderFn(event, menuItem) {
    const menu = menuItem;
    let findItemIndex = menu.items.findIndex(
      (item) => item.type == event.type
    );
    if (findItemIndex != -1) {
      menu.items[findItemIndex] = event;
    } else {
      menu.items.push(event);
    }
    this.selectedItems = menu;
  }

  removeOrderFn(event, menuItem) {
    const menu = menuItem;
    let findItemIndex = menu.items.findIndex(
      (item) => item.type == event.type
    );
    if (findItemIndex != -1) {
      menu.items[findItemIndex] = event;
    } else {
      menu.items.push(event);
    }
    this.selectedItems = menu;
  }

  // this._modalCtrl.dismiss();

  submitForm() {
    console.log(this.selectedItems);
    this.selectedItems.count =  (this.selectedItems.items.map(item => {
      return item.quantity > 0 && item.quantity
    })).reduce(function(acc, val) { return acc + val; }, 0);

    let orderPrice = this.selectedItems.items.map(element => {
      return element.quantity > 0 && (element.quantity*element.price)
    });

    this.selectedItems.orderPrice = orderPrice.reduce(function(acc, val) { return acc + val; }, 0);
    
    this._modalCtrl.dismiss(this.selectedItems);
  }

  isDisabled() {
    return false;
  }
}
