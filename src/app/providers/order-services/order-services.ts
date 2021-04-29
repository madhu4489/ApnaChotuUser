import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root',
})
export class OrderServicesProvider {
  cartData: any = [];
  orderItemsCount:number = 0;
  orderItemsPrice: number = 0

  restaurantName: any = [];
  isDeliveryFee:any;

  constructor(public http: HttpClient) {
    console.log("Hello CartDataProvider Provider");
  }

  addCartData(_data) {
    this.cartData = _data;
    // this.orderItemsCount = 

     let count = this.cartData.map(element => {
        return element.count
      });

      let price = this.cartData.map(element => {
        return element.orderPrice
      });

      this.orderItemsCount = count.reduce(function(acc, val) { return acc + val; }, 0);
      this.orderItemsPrice = price.reduce(function(acc, val) { return acc + val; }, 0);


    console.log(_data, "_data_data services", this.orderItemsCount)
  }

  clearCartData() {
    this.cartData = [];
    console.log("Clear Cart Data");
  }

  getCartData() {
    console.log("Get Cart Data");
    return this.cartData;
  }

  getOrderDeatils(){
    return {'count': this.orderItemsCount, 'price' :this.orderItemsPrice}
  }

}
