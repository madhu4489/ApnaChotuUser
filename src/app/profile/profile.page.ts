import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { LocationPage } from '../location/location.page';
import { SignupUserComponent } from './signup-user/signup-user.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userDetails: any;

  userOptions: any = [
    {
      name: 'Saved Address',
      value: 'addressEdit',
      icon: 'business',
      active: true,
    },
    { name: 'Past Orders', value: 'ordes', icon: 'bag-handle', active:true },
    { name: 'Logout', value: 'logout', icon: 'log-out', active: true },
  ];

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    public alertController: AlertController
  ) {
   
  }

  ngOnInit() {
    if (localStorage.getItem('userDetails')) {
      this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    }
  }

  
  backHandler() {
    this.navController.navigateBack(['/dashboard']);
  }

  async editProfile() {
    const modalRef = await this.modalController.create({
      component: SignupUserComponent,
      cssClass: 'myLoginPopup',
      backdropDismiss: true,
      componentProps: {
        isEditMode: true,
        storedUserDetails: this.userDetails,
      },
    });
    modalRef.onDidDismiss().then((res: any) => {
      if (localStorage.getItem('userDetails')) {
        this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
      }
      
    });

    await modalRef.present();
  }

  goto(go) {
    if (go === this.userOptions[0].value) {
      this.saveAddress();
    }else if(go === this.userOptions[2].value){
    
      this.presentAlertConfirm();
    }
    else if(go === this.userOptions[1].value){
      this.navController.navigateForward(['/orders', 'past']);
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      subHeader: 'Are you sure want to logout?',
      buttons: [
        
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Logout',
          handler: () => {
            localStorage.clear();
            // localStorage.removeItem('userDetails');
            // localStorage.removeItem('selectedLocation');
            // localStorage.removeItem('deliveryLocations');
            // localStorage.removeItem('jwt');
            this.backHandler();
            console.log('Confirm Okay');
          },
        },
      ],
    });
    await alert.present();
  }


  async saveAddress() {
    const modalRef = await this.modalController.create({
      component: LocationPage,
      backdropDismiss: false,
      componentProps: {
        isEditMode: true,
      },
    });
    await modalRef.present();
  }
}
