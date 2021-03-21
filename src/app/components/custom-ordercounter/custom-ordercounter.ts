import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";

@Component({
  selector: "custom-ordercounter",
  templateUrl: "custom-ordercounter.html"
})
export class CustomOrdercounterComponent implements OnInit {
  text: string;
  @Input() foodItem: any;
  @Output() recevieOrder = new EventEmitter();
  public menuOrder: string;
  public selectedOrder: any = [];
  // public menuOrderPrice: number = 0;
  // public count: number = 0;

  constructor() {
    console.log("Hello CustomOrdercounterComponent Component");
  }

  ngOnInit() {

    if (this.foodItem) {
      // this.count = this.foodItem.count;
      // this.menuOrderPrice = this.foodItem.totalprice;
    }
    //called after the constructor and called  after the first ngOnChanges()
  }

  clickFn(val: any) {

    this.foodItem.count =
      val == 1 ? this.foodItem.count + 1 : this.foodItem.count - 1;

    let price = Number(this.foodItem.price);
    if (val == 1) {
      this.menuOrder = this.foodItem.name;
      this.foodItem.orderPrice = this.foodItem.orderPrice + price;
    } else {
      this.foodItem.orderPrice = this.foodItem.orderPrice - price;
    }

    this.selectedOrder = {
      vendorID:this.foodItem.vendorID,
      id:this.foodItem.id,
      group:this.foodItem.group,
      count: this.foodItem.count,
      name: this.foodItem.name,
      price: this.foodItem.price,
      type: this.foodItem.type,
      totalprice: this.foodItem.orderPrice,
      orderPrice: this.foodItem.orderPrice
    };

    this.recevieOrder.emit(this.selectedOrder);
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
    this.foodItem.forEach(function(order) {
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
}
