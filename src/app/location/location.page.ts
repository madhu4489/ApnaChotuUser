import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SharedService } from '../providers/shared.service';
import { ChooseLocationComponent } from './choose-location/choose-location.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  @Input() isEditMode = null;
  public savedLocations: any = [];
  offset:number = 0;
  isloading:boolean;

  constructor(
    private navController: NavController,
    public modalController: ModalController,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.isloading = false;
    this.getAllAddress();
  }

  backHandler() {
    if (!this.isEditMode) {
      this.navController.back();
    } else {
      this.modalController.dismiss();
    }
  }

  async openAddLocation(details?: any) {
    const modalRef = await this.modalController.create({
      component: ChooseLocationComponent,
      cssClass: 'my-custom-model',
      componentProps: {
        details: details,
      },
    });
    await modalRef.present();
    modalRef.onDidDismiss().then((res: any) => {
      console.log(res)
      if (res.data) {
        this.savedLocations = [];
        this.isloading = false;
        this.getAllAddress();
      }
    });
  }
  gotoEdit() {}

  selectLocation(location) {
    if (this.isEditMode) {
      this.openAddLocation(location);
    } else {
      localStorage.setItem('selectedLocation', JSON.stringify(location));
      this.backHandler();
    }
  }


  getAllAddress() {
    this.sharedService.getAllAddress().then((data) => {
      this.isloading = true;
      let serverData =  data['data'];
      console.log(serverData, "serverData")
      if(serverData){
          this.savedLocations = serverData;
      }
    });
  }
}
