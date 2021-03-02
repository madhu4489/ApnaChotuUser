import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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
    // { name: 'About us', value: 'about', icon: '', active:true },
    { name: 'Logout', value: 'logout', icon: 'log-out', active: true },
  ];
  constructor(
    private navController: NavController,
    private modalController: ModalController
  ) {
    if (localStorage.getItem('userDetails')) {
      this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    }
  }

  ngOnInit() {}

  backHandler() {
    this.navController.navigateBack(['/dashboard']);
  }

  async editProfile() {
    const modalRef = await this.modalController.create({
      component: SignupUserComponent,
      cssClass: 'myLoginPopup',
      backdropDismiss: false,
      componentProps: {
        isEditMode: true,
        storedUserDetails: this.userDetails,
      },
    });
    await modalRef.present();
  }

  goto(go) {
    if (go === this.userOptions[0].value) {
      this.saveAddress();
    }
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
