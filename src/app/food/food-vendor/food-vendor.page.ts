import { IonContent } from '@ionic/angular';
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
  isVeg: boolean;
  isloading: boolean;
  backUpMenus: any = [];
  terms: string = '';
  noResults:boolean;
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  @ViewChildren('scrollTo') scrollComponent: any;


  @ViewChild(IonContent, {static: true}) content: IonContent;

  public storeOrderCount: number = 0;
  public storeOrderPrice: number = 0;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public loader: LoadingController,
    public actionSheetController: ActionSheetController,
    private cartDataProvider: CartDataProvider
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.getRestaurantVendor(this.route.snapshot.params.id);
    }
  }

  ionViewWillEnter() {
    //console.log('Ion View Will Enter ');

    this.cartDataProvider.setRestName(this.details);

    this.storeOrderCount = 0;
    this.storeOrderPrice = 0;
    this.cartDataProvider.removeCartItems();
    this.groups = [];
    this.getRestaurantVendor(this.route.snapshot.params.id);
  }

  backHandler() {
    this.cartDataProvider.setRestName(null);
    this.navController.back();
  }

  async getRestaurantVendor(id?: any) {
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.getRestaurantVendor(id).then((resp) => {
        this.isloading = true;

        //console.log(resp, "data")

        const data = resp.data || resp[0];
        this.details = data;

        
        data['menu'].forEach((element, index) => {
          this.groups[index] = {
            name: element.group,
            is_active: element.is_active,
            count: element.items.length,
          };
        });

        this.backUpMenus = data['menu'];
        this.menus = this.backUpMenus;
        this.cartDataProvider.setRestName(data);

        let _cartData = this.cartDataProvider.getCartData();
        if (_cartData && _cartData?.length != 0) {
          this.scrollToTop();
          this.isVeg = false;
          this.storeOrderPrice = 0;
          _cartData.forEach((_cartItem) => {
            this.storeOrderCount = this.storeOrderCount + _cartItem.count;
            this.storeOrderPrice = this.storeOrderPrice + _cartItem.totalprice;
            this.details.menu.forEach((element, index) => {
              if (element.id === _cartItem.groupId) {
                element.items.forEach((items, itemIndex) => {
                  if (items.id === _cartItem.itemId) {
                    //console.log(_cartItem, '_cartItem');
                    //console.log(items);
                    this.details.menu[index].items[itemIndex].count =
                      _cartItem.count;
                    this.details.menu[index].items[itemIndex].orderPrice =
                      _cartItem.count * _cartItem.price;
                  }
                });
              }
            });
          });
        }
        loading.dismiss();
      });
    });
  }

  menuChanged(event) {
    this.setDefault = event.detail.value;
    this.filterMenus();
  }

  filterMenus() {
    this.showMenuItems = this.menus.items;
  }

  vegFilter(event) {
    this.isVeg = event;
    this.menus = this.isVeg
      ? this.backUpMenus.map((item) => {
          return {
            group: item.group,
            id: item.id,
            is_active: item.is_active,
            items: item.items.filter((item) => {
              if (item.type == 'v') {
                //console.log(item);
                return item;
              }
            }),
          };
        })
      : this.backUpMenus;

    //console.log(this.menus);
  }

  async presentActionSheet() {
    let buttons = [];

    this.groups.forEach((group, index) => {
      let button = {
        cssClass: 'action-button',
        text: `${group.name} (${group.count})`,
        handler: () => {
          this.setDefault = group.name;
          this.gotoMenu(index);
          //console.log('Delete clicked', group);
        },
      };
      buttons.push(button);
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Menu',
      cssClass: 'action-sheet-controller',
      buttons: buttons,
    });
    await actionSheet.present();
  }

  async myMethod() {
    await this.myContent.scrollToBottom();
  }

  async gotoMenu(value) {
    //console.log(value);
    let pos = value;
    await this.myContent.scrollToPoint(
      0,
      this.scrollComponent['_results'][pos].el.offsetTop,
      800
    );
  }

  recevieOrderFn(items: any) {
    this.cartDataProvider.addCartData(items);
    this.cartDataProvider.removeCartItems();
    let _tempCartData = this.cartDataProvider.getCartData();
    this.storeOrderCount = 0;
    this.storeOrderPrice = 0;
    _tempCartData.forEach((currentItem) => {
      this.storeOrderCount = this.storeOrderCount + currentItem.count;
    });
    _tempCartData.forEach((currentItem) => {
      this.storeOrderPrice = this.storeOrderPrice + currentItem.orderPrice;
    });
  }

  viewCart() {
    //this.vegFilter();
   this.navController.navigateForward(['/cart-details']);
  }

  showNotFound(items){
    return items.length > 0 ? false : true;
  }

  scrollToTop() {
    this.content.scrollToTop(0);
  }
}
