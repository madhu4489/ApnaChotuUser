import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  LoadingController,
  NavController,
} from '@ionic/angular';
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

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public loader: LoadingController,
    public actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.getRestaurantVendor(this.route.snapshot.params.id);
    }
  }

  backHandler() {
    this.navController.back();
  }

  async getRestaurantVendor(id?: any) {
    // const loading = await this.loader.create({
    //   cssClass: 'my-custom-class',
    //   message: 'Please wait...',
    // });
    // await loading.present().then(() => {

    // });

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

      console.log(this.backUpMenus);
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
}
