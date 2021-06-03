import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
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
    public sharedService: SharedService,
    public alertController: AlertController,
    public loader: LoadingController,

  ) {}

  ngOnInit() {
    this.isloading = false;
    this.getAllAddress();

  

  }

  backHandler(location?:any) {
    console.log(this.isEditMode)
    if (this.isEditMode == false) {
      this.navController.back();
    } else {
      this.modalController.dismiss(location);
    }
  }

  async openAddLocation(details?: any) {
    const modalRef = await this.modalController.create({
      component: ChooseLocationComponent,
      cssClass: 'my-custom-model',
      backdropDismiss: true,
      componentProps: {
        details: details,
        addressList: this.savedLocations
      },
    });
    await modalRef.present();
    modalRef.onDidDismiss().then((res: any) => {
      //console.log(res)
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
      this.backHandler(location);
    }
  }


  getAllAddress() {
    this.sharedService.getAllAddress().then((data) => {
      this.isloading = true;
      let serverData =  data['data'];
      //console.log(serverData, "serverData")
      if(serverData){
          this.savedLocations = serverData;
      }
    });
  }


  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      subHeader: 'Are you sure want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.deleteHandler(id);
            //console.log('Confirm Okay');
          },
        },
        
      ],
    });

    await alert.present();
  }

  async deleteHandler(id) {
    let selectedLocation = JSON.parse(localStorage.getItem('selectedLocation'));
    if(selectedLocation && selectedLocation.id === id){
      localStorage.setItem('selectedLocation', '');
    }
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.deleteAddress(id).then((resp) => {
        loading.dismiss();
       this.getAllAddress();
      });
    });
  }


}
