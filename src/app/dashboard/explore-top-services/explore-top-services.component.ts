import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-explore-top-services',
  templateUrl: './explore-top-services.component.html',
  styleUrls: ['./explore-top-services.component.scss'],
})
export class ExploreTopServicesComponent implements OnInit {
  public subCategories: any = [
    { id:'18', name: 'Grocery', icon: '../../../assets/icon/grocry_small.svg', type:"order" },
    { id:null, name: 'Medicine', icon: '../../../assets/icon/med_small.svg', type:"order" },
    { id:null, name: 'Cabs', icon: '../../../assets/icon/cabs_small.svg', type:"call" },
    { id:null, name: 'Appliance Repair', icon: '../../../assets/icon/reapir_small.svg', type:"call" },
    { id:null, name: 'Online Services', icon: '../../../assets/icon/online_small.svg' , type:"call" },
    { id:null, name: 'Apna Chotu Specials', icon: '../../../assets/icon/apna.png', type:"call" },
  ];

  // 5 apna chotu ser

  constructor(private navController:NavController) {}

  ngOnInit() {}

  gotoFood(){
    this.navController.navigateForward(['../food']);
  }

  goToMiscOrder(name, type?:any, id?:any){
    console.log(name, type, id, "XEEEEE");
    if(id != null) {
      this.navController.navigateForward(['/vegetables', id]);
    }else{
      if(type!= 'call'){
        this.navController.navigateForward(["/misc-order", name]);
      }else{
        this.navController.navigateForward(['/more-servicer', id, name]);
      }
    }
  }

  vegetables(id) {
    this.navController.navigateForward(['/vegetables', id]);
  }

}
