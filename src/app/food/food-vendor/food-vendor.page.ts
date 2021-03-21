import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { CartDataProvider } from 'src/app/providers/cart-data/cart-data';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-food-vendor',
  templateUrl: './food-vendor.page.html',
  styleUrls: ['./food-vendor.page.scss'],
})
export class FoodVendorPage implements OnInit {
  details: any = [];
  groups: any = [];
  menus: any = [];
  setDefault: any;
  showMenuItems: any = [];
  isVeg: boolean = false;
  isloading: boolean;
  backUpMenus: any = [];
  // @ViewChild(Content) content: Content;
  @ViewChildren('scrollTo') scrollComponent: any;


  public storeOrderCount: number = 0;
  public storeOrderPrice: number = 0;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public loader: LoadingController,
    public actionSheetController: ActionSheetController,
    private cartDataProvider: CartDataProvider,
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.getRestaurantVendor(this.route.snapshot.params.id);
    }
  }

  ionViewWillEnter() {
    console.log("Ion View Will Enter ");

    this.cartDataProvider.setRestName(this.details);

    this.storeOrderCount = 0;
    this.storeOrderPrice = 0;
    this.cartDataProvider.removeCartItems();
    // this.menu = [];
    // this.menuList = [];
    // this.finalMenuList = [];
    // this.courseType = [];
    // this.imageUrl = "";
    // this.storeOrder = [];
    this.getRestaurantVendor(this.route.snapshot.params.id);

    // console.log("Count: ", _count.length);
    // console.log("Final Menu Count: ", this.finalMenuList.length);
  }

  backHandler() {
    this.cartDataProvider.setRestName(null);
    this.cartDataProvider.clearCartData();
    this.navController.back();
  }

  async getRestaurantVendor(id?: any) {
    this.sharedService.getRestaurantVendor(id).then((resp) => {
      this.isloading = true;
      const data = resp[0];
      this.details = data;
      for (let value of Object.values(data['menu'])) {
        this.groups.push({
          name: value['group'],
          is_active: value['is_active'],
        });
      }
      this.backUpMenus = data['menu'];
      this.menus = this.backUpMenus;
      this.cartDataProvider.setRestName(data);

      let _cartData = this.cartDataProvider.getCartData();

        console.log(_cartData, "_cartItem::::");
        console.log(' this.finalMenuList', this.details.menu);
        if (_cartData.length != 0) {
          this.storeOrderPrice = 0;
          _cartData.forEach(_cartItem => {
            this.storeOrderCount = this.storeOrderCount + _cartItem.count;
            this.storeOrderPrice = this.storeOrderPrice + _cartItem.totalprice;
            this.details.menu.forEach((element, i) => {
              const isThere = (element) => element.id === _cartItem.id;
              let Menuindex = this.details.menu.findIndex(isThere);
              if (Menuindex > -1) {
                element.items.forEach((items, i) => {
                  const isThereItem = (element) => element.id === _cartItem.id;
                  let itemsIndex = element.items.findIndex(isThereItem);
                  if (itemsIndex > -1) {
                    console.log(this.details.menu[Menuindex].items[itemsIndex])
                    this.details.menu[Menuindex].items[itemsIndex].count = _cartItem.count;
                    this.details.menu[Menuindex].items[itemsIndex].orderPrice = this.details.menu[Menuindex].items[itemsIndex].count *
                      this.details.menu[Menuindex].items[itemsIndex].price;
                  }
                })
              }

            });
          });
        }
      // this.setDefault = this.groups[0].name;
      //  this.filterMenus();
      // loading.dismiss();
    });
  }

  menuChanged(event) {
    this.setDefault = event.detail.value;
    console.log(this.setDefault);
    // this.isVeg = false;
    this.filterMenus();
  }

  filterMenus() {
    //  let menu = this.menus.filter(item => item.group === this.setDefault);
    this.showMenuItems = this.menus.items;
  }

  vegFilter() {
    console.log(this.isVeg);
    this.isVeg = !this.isVeg;
    this.menus =  this.isVeg ? this.backUpMenus.map((item) => {
      return {
        group: item.group,
        id: item.id,
        is_active: item.is_active,
        items: item.items.filter((item) => {
          if (item.type == 'v') {
            console.log(item)
            return item;
          }
        }),
      };
    }) : this.backUpMenus;

    console.log(this.menus);
  }

  async presentActionSheet() {
    let buttons = [];
    for (let group of this.groups) {
      let button = {
        cssClass: 'action-button',
        text: group.name,
        handler: () => {
          this.setDefault = group.name;
          console.log('Delete clicked', group.name);
        },
      };
      buttons.push(button);
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Menu',
      cssClass: 'my-custom-menu-class',
      buttons: buttons,
    });
    await actionSheet.present();
  }

  gotoMenu(value) {
    console.log(value);
    let pos = value - 1;
    // this.content.scrollTo(
    //   0,
    //   this.scrollComponent["_results"][pos].nativeElement.offsetTop,
    //   800
    // );
  }

  recevieOrderFn(items: any){
    this.cartDataProvider.addCartData(items);
    this.cartDataProvider.removeCartItems();

    let _tempCartData = this.cartDataProvider.getCartData();
    this.storeOrderCount = 0;
    this.storeOrderPrice = 0;
    console.log("Temp Data: ", JSON.stringify(_tempCartData));
    _tempCartData.forEach(currentItem => {
      this.storeOrderCount = this.storeOrderCount + currentItem.count;
    });
    _tempCartData.forEach(currentItem => {
      this.storeOrderPrice = this.storeOrderPrice + currentItem.orderPrice;
    });

    console.log("Store Order: ", JSON.stringify(_tempCartData));

  }

  viewCart() {
    this.navController.navigateForward(["/cart-details"]);
  }
}
