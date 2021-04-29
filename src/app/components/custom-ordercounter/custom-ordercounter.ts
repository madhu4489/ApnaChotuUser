import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'custom-ordercounter',
  templateUrl: 'custom-ordercounter.html',
})
export class CustomOrdercounterComponent implements OnInit {
  text: string;
  @Input() foodItem: any;
  @Input() groupId: any;
  @Input() vendorId: any;

  @Input() variantDetails: any;
  @Input() showVariant: boolean = true;
  @Output() recevieOrder = new EventEmitter();
  @Output() removeOrder = new EventEmitter();

  public menuOrder: string;
  public selectedOrder: any = [];
  // public menuOrderPrice: number = 0;
  public count: number = 0;

  constructor() {
    console.log('Hello CustomOrdercounterComponent Component');
  }

  // ? this.foodItem.defaultVariantDetails.quantity

  ngOnInit() {

    if (!this.showVariant) {
      this.count = this.variantDetails.quantity;
    }
  }

  clickFn(val: any) {
    this.count = val == 1 ? this.count + 1 : this.count - 1;

    // let price = Number(this.foodItem.price);
    // if (val == 1) {
    //   this.menuOrder = this.foodItem.name;
    //   this.foodItem.orderPrice = this.foodItem.orderPrice + price;
    // } else {
    //   this.foodItem.orderPrice = this.foodItem.orderPrice - price;
    // }

    // this.selectedOrder = {
    //   vendorId:this.vendorId,
    //   id:this.foodItem.id,
    //   group:this.groupId,
    //   count: this.foodItem.count,
    //   name: this.foodItem.name,
    //   price: this.foodItem.price,
    //   type: this.foodItem.type,
    //   totalprice: this.foodItem.orderPrice,
    //   orderPrice: this.foodItem.orderPrice
    // };
    let Item = {
      itemId: this.foodItem.id,
      quantity: this.count,
      price: this.variantDetails.price,
      type: this.variantDetails.type,
    };

    // console.log(Item, 'Item');

    this.recevieOrder.emit(Item);
  }

  filterList(items) {
    let idxes;

    this.foodItem.forEach((element, index) => {
      if (element.name === items.name) {
        idxes = index;
      }
    });

    if (idxes || idxes == 0) {
      this.foodItem[idxes] = items;
    } else {
      this.foodItem.push(items);
    }

    let num = 0;
    let num1 = 0;
    this.foodItem.forEach(function (order) {
      if (order.count > 0) {
        num = num + order.count;
      }

      if (order.price > 0) {
        num1 = num1 + order.totalprice;
      }
    });

    //this.storeOrderCount = num;
    //this.storeOrderPrice = num1;
  }

  removeOrderFn() {
    this.count = this.count - 1;
    let Item = {
      itemId: this.foodItem.id,
      quantity: this.count,
      price: this.variantDetails.price,
      type: this.variantDetails.type,
    };
    this.removeOrder.emit(Item);
  }
}
