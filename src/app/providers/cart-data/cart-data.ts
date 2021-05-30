import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root',
})
export class CartDataProvider {
  cartData: any = [];
  restaurantName: any = [];
  isDeliveryFee:any;

  constructor(public http: HttpClient) {
    //console.log("Hello CartDataProvider Provider");
  }

  addCartData(_data) {

    this.cartData.forEach((element, index) => {
      if (element.name == _data.name) {
        this.cartData.splice(index, 1);
      }
    });
    
    this.cartData.push(_data);
    this.setCartData(this.cartData);
    //console.log("Add Cart Data");
  }

  setCartData(_data) {
    this.cartData = [];
    this.cartData = _data;
    //console.log("Set Cart Data");
  }

  removeCartItems() {
    let _data = _.filter(this.cartData, function(o) {
      return o.count > 0;
    });
    //console.log("remove Cart Data");
    this.setCartData(_data);
  }

  clearCartData() {
    this.cartData = [];
    //console.log("Clear Cart Data");
  }

  getCartData() {
    //console.log("Get Cart Data");
    return this.cartData;
  }

  setRestName(_name) {
    localStorage.setItem('selectedHotel',  JSON.stringify(_name));
  }

  getRestName() {
    if (localStorage.getItem('selectedHotel')) {
      return JSON.parse(localStorage.getItem('selectedHotel'));
    }
  }
}
