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

    this.getAllAddress()


    if (this.isEditMode) {
      this.savedLocations = [
        {
          id: '0',
          flat: '5-1-92/5/15',
          street: 'Ganesh Nagar',
          landmark: 'TTD Kalyanamandapam',
          phone: '9963887640',
          locality: 'Sangareddy',
          type: 'Home',
        },
        {
          id: '1',
          flat: '5-1-92/5/15',
          street: 'Ganesh Nagar',
          landmark: 'TTD Kalyanamandapam',
          phone: '9963887640',
          locality: 'Sangareddy',
          type: 'Office',
        },
        {
          id: '2',
          flat: '5-1-92/5/15',
          street: 'Ganesh Nagar',
          landmark: 'TTD Kalyanamandapam',
          phone: '9963887640',
          locality: 'Sangareddy',
          type: 'New Home',
        },
      ];
    }
  }




  backHandler() {
    if (!this.isEditMode) {
      this.navController.navigateBack(['/dashboard']);
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
        this.isloading = false;
        this.getAllAddress();
        if(!this.isEditMode){
          this.isloading = false;
        }
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
      if(!this.sharedService.isBrowser){
        serverData = JSON.parse(serverData).data;
      }

      if(serverData){
          this.savedLocations = serverData;
      }

    });
  }


}
