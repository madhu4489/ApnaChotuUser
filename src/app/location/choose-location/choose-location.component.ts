import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.component.html',
  styleUrls: ['./choose-location.component.scss'],
})
export class ChooseLocationComponent implements OnInit {
  @Input() details = null;
  isOtherName: boolean = false;
  currentIndex:number=-1;
  flat: string="5-1-92/5/15";
  street: string;
  landmark: string;
  contact: string;
  locality: string;
  type: string;
  typeText: string;
  public deliveryLocations: any = [];
  defaultOption = { charge: '0', id: 0, is_active: 1, name: 'Select' };
  id:any;
  typeOptions: any = [
    { name: 'Home', id: 0 },
    { name: 'Office', id: 1 },
    { name: 'Others', id: 2 },
  ];

  constructor(
    public modalController: ModalController,
    public loader: LoadingController,
    public sharedService: SharedService,
    private navController: NavController,
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
    if (this.details) {
      console.log('details', this.details);
      this.flat = this.details.h_no;
      this.street = this.details.street;
      this.landmark = this.details.landmark;
      this.contact = this.details.contact_no;
      this.locality = this.details.locality;
      this.type = this.details.address_type;
      this.id = this.details.id;

      if(this.details.address_type === "OTHERS"){
          this.isOtherName = true;
          this.typeText = this.details.address_type;
          this.currentIndex = 2;
      }else if(this.details.address_type === "HOME"){
        this.currentIndex = 0;

      }else if(this.details.address_type === "OFFICE"){
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
    this.isOtherName = type === 'Others' ? true : false;
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
    let addAddress = {
      h_no: this.flat,
      street: this.street,
      landmark: this.landmark,
      contact_no: this.contact,
      locality: this.deliveryLocations[this.locality].name,
      address_type: this.type,
    };

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.addAddress(addAddress).then((resp) => {
        console.log(resp)
        loading.dismiss();
        this.modalController.dismiss({
        dismissed: true,
        address:addAddress
      });
    });

    });
  }

  async updateAddress() {
    let addAddress = {
      id:this.id,
      h_no: this.flat,
      street: this.street,
      landmark: this.landmark,
      contact_no: this.contact,
      locality: this.locality,
      address_type: this.type,
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
        address:addAddress
      });
    });

    });
  }


  delete(){
    
  }

}
