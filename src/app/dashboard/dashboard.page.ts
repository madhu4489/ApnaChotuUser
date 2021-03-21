import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';
import { SignupUserComponent } from '../profile/signup-user/signup-user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  chooseLocation: string = 'Unnamed Road, Sangareddy';
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay:3000, 
    loop:"true"
  };

  constructor(public sharedService:SharedService, public modalController: ModalController, private navController:NavController) {
    
  }

  ngOnInit() {
    this.getlocationsFn();
    
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    if (localStorage.getItem('selectedLocation')) {
      let address = JSON.parse(localStorage.getItem('selectedLocation'));
      this.chooseLocation = (address.address_name || address.address_type)  + ', ' + address.locality;
    }
  }

  getlocationsFn() {
    this.sharedService.getLocations().then((data) => {
      let serverData =  data['data'];
      if(!this.sharedService.isBrowser){
        serverData = JSON.parse(serverData).data;
      }
      localStorage.setItem('deliveryLocations', JSON.stringify(serverData));
    });
  }

  profileHandler(){
    if(localStorage.getItem('userDetails')){
      this.navController.navigateBack(['/profile']);
    }else{
      this.openAddLocation()
    }
  }




  async openAddLocation(isFromPage?:any) {
    const modalRef = await this.modalController.create({
      component: SignupUserComponent,
      cssClass: 'myLoginPopup',
      backdropDismiss: false,
      componentProps: {isFromPage: isFromPage}
    });
    await modalRef.present();
  }

  gotoLocation(){
    if(localStorage.getItem('userDetails')){
      this.navController.navigateBack(['/location']);
    }else{
      this.openAddLocation('location')
    }
  }

}
