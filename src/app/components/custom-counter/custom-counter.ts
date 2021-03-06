import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";

@Component({
  selector: "custom-counter",
  templateUrl: "custom-counter.html"
})
export class CustomCounterComponent implements OnInit{
  @Input() foodItem: any;
  @Input() groupId: any;
  @Input() vendorId:any;
  @Output() recevieOrder = new EventEmitter();
  public menuOrder: string;
  public selectedOrder: any = [];

  constructor() {}

  ngOnInit(){
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
      vendorId:this.vendorId,
      itemId:this.foodItem.id || this.foodItem.itemId,
      groupId:this.groupId,
      count: this.foodItem.count,
      name: this.foodItem.name,
      price: this.foodItem.price,
      type: this.foodItem.type,
      totalprice: this.foodItem.orderPrice,
      orderPrice: this.foodItem.orderPrice
    };
    this.recevieOrder.emit(this.selectedOrder);
  }
}
