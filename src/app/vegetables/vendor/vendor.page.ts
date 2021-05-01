import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  IonContent,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { OrderServicesProvider } from 'src/app/providers/order-services/order-services';
import { SharedService } from 'src/app/providers/shared.service';
import { RemoveItemsComponent } from '../remove-items/remove-items.component';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.page.html',
  styleUrls: ['./vendor.page.scss'],
})
export class VendorPage implements OnInit {
  categoryId: any;

  defaultVariantDetails: any = [];

  details: any = [];
  groups: any = [];
  menus: any = [];
  setDefault: any;
  showMenuItems: any = [];
  isVeg: boolean = false;
  isloading: boolean;
  backUpMenus: any = [];
  terms: string;

  orderCountDetails:any;

  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  @ViewChildren('scrollTo') scrollComponent: any;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public orderServicesProvider: OrderServicesProvider,
    
    public loader: LoadingController,
    private modalController: ModalController,
    public actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.categoryId = this.route.snapshot.params.categoryId;
      this.getRestaurantVendor(this.route.snapshot.params.id);
    }
  }

  ionViewWillEnter() {
    console.log('Ion View Will Enter ');
    this.groups = [];
    this.getRestaurantVendor(this.route.snapshot.params.id);
  }

  backHandler() {
    this.orderServicesProvider.clearCartData()
    this.navController.navigateForward(['vegetables', this.categoryId]);
  }

  async getRestaurantVendor(id?: any) {
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.getRestaurantVendor(id).then((resp) => {
        this.isloading = true;
        const data = resp.data;
        this.details = data;

        data['menu'].forEach((element, index) => {
          this.groups[index] = {
            name: element.group,
            is_active: element.is_active,
            count: element.items.length,
            
          };
        });

        this.details.menu.forEach((element) => {

          console.log(element, "element");
          element.items.forEach((item) => {

            item.defaultVariantDetails = item.price_quantity[0];
            item.items = item.price_quantity.map(priceQuantity => {
              return { itemId: item.id, quantity: 0, price: priceQuantity.price, type: priceQuantity.quantity }
            });;
            item.selectedVariants = 0;
          });
        });
        this.backUpMenus = data['menu'];
        this.menus = this.backUpMenus;


        let _cartData = this.orderServicesProvider.getCartData();

        if(_cartData && _cartData.length != 0){
          this.orderCountDetails = this.orderServicesProvider.getOrderDeatils();

            _cartData.forEach((_cartItem) => {
              this.details.menu.forEach((element) => {

                if (element.id === _cartItem.groupId) {
                  element.items.forEach((item) => {
                    if(item.id == _cartItem.id){
                        item.count =  (_cartItem.items.map(item => {
                          return item.quantity > 0 && item.quantity
                        })).reduce(function(acc, val) { return acc + val; }, 0);
                        item.items = _cartItem.items
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

  async presentActionSheet() {
    let buttons = [];

    this.groups.forEach((group, index) => {
      let button = {
        cssClass: 'action-button',
        text: `${group.name} (${group.count})`,
        handler: () => {
          this.setDefault = group.name;
          this.gotoMenu(index);
          console.log('Delete clicked', group);
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
    console.log(value);
    let pos = value;
    await this.myContent.scrollToPoint(
      0,
      this.scrollComponent['_results'][pos].el.offsetTop,
      800
    );
  }

  orderDeatils: any = [];
  groupId:any;
  recevieOrderFn(event, menuItem, groupId) {

    this.groupId = groupId;
    if(menuItem.price_quantity.length > 1){
      this.openQuantites(menuItem);
    }else{

      const findItemIndex = this.orderDeatils.findIndex(
        (item) => item.id == menuItem.id
      );

      if(findItemIndex == -1){
        menuItem.count = event+1; 
        menuItem.groupId = this.groupId;
        menuItem.vendorId =  this.route.snapshot.params.id;
        menuItem.items[0].quantity = event+1; 
        menuItem.orderPrice =  menuItem.items[0].quantity *  menuItem.items[0].price;
        this.orderDeatils.push(menuItem);
      }else{
        
menuItem.count = event+1; 

        this.orderDeatils[findItemIndex].vendorId = this.route.snapshot.params.id;
        this.orderDeatils[findItemIndex].groupId = this.groupId;
        
        this.orderDeatils[findItemIndex].items[0].quantity =event+1;
       this.orderDeatils[findItemIndex].count =  menuItem.count;
        this.orderDeatils[findItemIndex].orderPrice =  this.orderDeatils[findItemIndex].items[0].quantity * this.orderDeatils[findItemIndex].items[0].price;

        console.log(this.orderDeatils[findItemIndex].count, "countttt");
      }

      this.orderServicesProvider.addCartData(this.orderDeatils);
      this.orderCountDetails = this.orderServicesProvider.getOrderDeatils();
      this.groupId = null;
    }
  
   
  }



  async opengQuantityHandler(data) {

    let buttons = [];

    data.price_quantity.forEach((group, index) => {
      let button = {
        cssClass: 'action-button',
        text: group.quantity,
        handler: () => {
          // this.setDefault = group.name;
          // this.gotoMenu(index);
          data.defaultVariantDetails = group;
          console.log('Delete clicked', group, data);
        },
      };
      buttons.push(button);
    });

  
    const actionSheet1 = await this.actionSheetController.create({
      header: 'Available quantites',
      buttons: buttons,
    });
 
    await  actionSheet1.present();
  }


  async openQuantites(items) {
    const modalRef = await this.modalController.create({
      component: RemoveItemsComponent,
      cssClass: 'myLoginPopup',
      backdropDismiss: false,
      componentProps: {
        isEditMode: true,
        selectedItems: items,
      },
    });
    modalRef.onDidDismiss().then((res: any) => {
    
      if(res.data){
        this.addOrder(res.data)
      }
      
    });

    await modalRef.present();
  }


  addOrder(menuItem){
    menuItem.groupId = this.groupId;
    menuItem.vendorId =  this.route.snapshot.params.id;
    menuItem.selectedVariants =  menuItem.items.filter(item =>item.quantity > 0).length;

    const findItemIndex = this.orderDeatils.findIndex(
      (item) => item.id == menuItem.id
    );


    if (findItemIndex == -1) {
        this.orderDeatils.push(menuItem);
      } else {
        this.orderDeatils[findItemIndex] = menuItem;
    }

    this.orderServicesProvider.addCartData(this.orderDeatils);
    this.orderCountDetails = this.orderServicesProvider.getOrderDeatils();
    this.groupId = null;
    console.log(this.orderCountDetails, "orderCountDetails:::::");
  }

  viewCart(){
    console.log(this.orderDeatils, "this.orderDeatils")
    this.navController.navigateForward(['/view-kart']);
    
  }

}
