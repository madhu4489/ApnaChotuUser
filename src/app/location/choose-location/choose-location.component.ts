import { Component, Input, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.component.html',
  styleUrls: ['./choose-location.component.scss'],
})
export class ChooseLocationComponent implements OnInit {
  @Input() details = null;

  @Input() addressList:any;
  isOtherName: boolean = false;
  currentIndex: number = -1;
  flat: string = '';
  street: string;
  landmark: string;
  contact: string;
  locality: string;
  type: string;
  typeText: string;
  public deliveryLocations: any = [];
  defaultOption = { charge: '0', id: 0, is_active: 1, name: 'Select' };
  id: any;
  typeOptions: any = [
    { name: 'HOME', id: 0 },
    { name: 'OFFICE', id: 1 },
    { name: 'OTHERS', id: 2 },
  ];

  addressListArr:any = [];
  constructor(
    public modalController: ModalController,
    public loader: LoadingController,
    public sharedService: SharedService,
    private navController: NavController,
    public alertController: AlertController
  ) {
    if (localStorage.getItem('deliveryLocations')) {
      this.deliveryLocations = JSON.parse(
        localStorage.getItem('deliveryLocations')
      );
      this.deliveryLocations.unshift(this.defaultOption);
    } else {
      this.deliveryLocations.unshift(this.defaultOption);
    }
  }

  ngOnInit() {
    if(this.addressList.length > 0){
      this.addressListArr =this.addressList.map(element => element.address_type);
      this.addressListArr = [...new Set(this.addressListArr)];

      if( this.details?.address_type && this.addressListArr.indexOf(this.details.address_type) != -1 ){
       this.addressListArr.splice(this.addressListArr.indexOf(this.details.address_type), 1);
      }

      if( this.addressListArr.indexOf("OTHERS") != -1 ){
        this.addressListArr.splice(this.addressListArr.indexOf("OTHERS"), 1);
       }


      //console.log(this.addressListArr, "this.addressListArr")
      
    }
    if (this.details) {
      //console.log('details', this.details);
      this.flat = this.details.h_no;
      this.street = this.details.street;
      this.landmark = this.details.landmark;
      this.contact = this.details.contact_no;
      this.locality = this.details.locality;
      this.type = this.details.address_type;
      this.id = this.details.id;

      if (this.details.address_type === 'OTHERS') {
        this.isOtherName = true;
        this.typeText = this.details.address_name;
        this.currentIndex = 2;
      } else if (this.details.address_type === 'HOME') {
        this.currentIndex = 0;
      } else if (this.details.address_type === 'OFFICE') {
        this.currentIndex = 1;
      }
    }
  }

  backHandler() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  onSelectTypeHandler(type) {
    this.type = type;
    this.typeText = '';
    this.isOtherName = type === this.typeOptions[2].name ? true : false;
  }

  disabledButton(flat, street, locality) {
    if (!flat || !street || !locality || !this.type) {
      return true;
    }

    if (this.isOtherName && !this.typeText) {
      return true;
    }
  }

  async addAddress() {


    let checkType = this.addressListArr.forEach(element =>  element == this.type);


//console.log(checkType, "checkTypecheckTypecheckType")
    

let index = this.addressListArr.indexOf((this.type).toUpperCase());

if(index == -1){

  let addAddress = {
    h_no: this.flat,
    street: this.street,
    landmark: this.landmark,
    contact_no: this.contact,
    locality: this.locality,
    address_type: (this.type).toUpperCase(),
    address_name: this.typeText
  };

  const loading = await this.loader.create({
    cssClass: 'my-custom-class',
    message: 'Please wait...',
  });
  await loading.present().then(() => {
    this.sharedService.addAddress(addAddress).then((resp) => {
      //console.log(resp);
      loading.dismiss();
      this.modalController.dismiss({
        dismissed: true,
        address: addAddress,
      });
    });
  });
}else{
  this.presentAlertConfirm1((this.type).toUpperCase())
}
   
  }

  async updateAddress() {

    let index = this.addressListArr.indexOf((this.type).toUpperCase());

      if(index == -1){
        let addAddress = {
          id: this.id,
          h_no: this.flat,
          street: this.street,
          landmark: this.landmark,
          contact_no: this.contact,
          locality: this.locality,
          address_type: (this.type).toUpperCase(),
          address_name: this.typeText
        };

        const loading = await this.loader.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });

        await loading.present().then(() => {
          this.sharedService.updateAddress(addAddress).then((resp) => {
            loading.dismiss();
            this.modalController.dismiss({
              dismissed: true,
              address: addAddress,
            });
          });
        });
      }else{
        this.presentAlertConfirm1((this.type).toUpperCase())
      }

    
  }

  async deleteHandler() {
    let selectedLocation = JSON.parse(localStorage.getItem('selectedLocation'));
    if(selectedLocation && selectedLocation.id === this.id){
      localStorage.setItem('selectedLocation', '');
    }
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.deleteAddress(this.id).then((resp) => {
        loading.dismiss();
        this.modalController.dismiss({
          dismissed: true
        });
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      subHeader: 'Are you sure want to delete?',
      buttons: [
        
        {
          text: 'Okay',
          handler: () => {
            this.deleteHandler();
            //console.log('Confirm Okay');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertConfirm1(type) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Oops!',
      subHeader: `You have already added ${type} address.`,
      buttons: [
        

        {
          text: 'Okay',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          },
        },
      ],
    });

    await alert.present();
  }


}
