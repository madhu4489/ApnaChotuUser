import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.component.html',
  styleUrls: ['./choose-location.component.scss'],
})
export class ChooseLocationComponent implements OnInit {

  @Input() details = null;
  isOtherName: boolean = false;

  flat: string;
  street: string;
  landmark: string;
  contact: string;
  locality: string;
  type: string;
  typeText: string;
  public deliveryLocations: any = [];
  defaultOption = { 'charge': "0", 'id': 0, 'is_active': 1, name: "Select" };

  typeOptions:any =[{name:'Home', id:0}, {name:'Office', id:1}, {name:'Others', id:2}]

  constructor(public modalController: ModalController, public loader: LoadingController) {

    if(localStorage.getItem('deliveryLocations')){
      this.deliveryLocations = JSON.parse(localStorage.getItem('deliveryLocations'));
      this.deliveryLocations.unshift(this.defaultOption);
    }else{
      this.deliveryLocations.unshift(this.defaultOption);
    }
  }

  ngOnInit() {
    if(this.details){
      console.log('details', this.details);
      this.flat = this.details.flat;
    }
  }

  backHandler() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  onSelectTypeHandler(type){
    this.type = type;
    this.typeText = '';
    this.isOtherName = type === 'Others' ? true : false;
  }

  disabledButton(flat, street, locality) {
   if(!flat || !street || !locality || !this.type){
      return true
   };

   if(this.isOtherName && !this.typeText){
     return true
   }
  }

  async addAddress(){
    let addAddress = {
      flat: this.flat,
      street: this.street,
      landmark: this.landmark,
      contact: this.contact,
      locality: this.locality,
      type: this.type,
      typeText: this.typeText,
    }
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      // this.Api.getLocations().subscribe(data => {
      //   this.deliveryArea = data['data'];
      //   this.deliveryArea.unshift({ 'charge': "0", 'id': 0, 'is_active': 1, name: "Select" });
      //   loading.onDidDismiss();
      // });
      loading.dismiss();
      this.modalController.dismiss({
        dismissed: true,
        address:{...addAddress, localityName: this.deliveryLocations[this.locality].name}
      });
    });;

    
  }
  

}
