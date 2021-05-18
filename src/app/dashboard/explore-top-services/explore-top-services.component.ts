import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-explore-top-services',
  templateUrl: './explore-top-services.component.html',
  styleUrls: ['./explore-top-services.component.scss'],
})
export class ExploreTopServicesComponent implements OnInit {
  public subCategories: any = [
    { id:'1', name: 'Grocery', icon: '../../../assets/icon/grocry_small.svg', type:"order" },
    { id:'1', name: 'Medicine', icon: '../../../assets/icon/med_small.svg', type:"order" },
    { id:8, name: 'Cabs', icon: '../../../assets/icon/cabs_small.svg', type:"call" },
    { id:4, name: 'Appliance Repair', icon: '../../../assets/icon/reapir_small.svg', type:"call" },
    { id:3, name: 'Online Services', icon: '../../../assets/icon/online_small.svg' , type:"call" },
    { id:5, name: 'Apna Chotu Specials', icon: '../../../assets/icon/apna.png', type:"call" },
  ];

  // 5 apna chotu ser

  constructor(private navController:NavController) {}

  ngOnInit() {}

  gotoFood(){
    this.navController.navigateForward(['../food']);
  }

  goToMiscOrder(name, type?:any, id?:any){

    if(type!= 'call'){
      this.navController.navigateForward(["/misc-order", name]);
    }else{
      this.navController.navigateForward(['/more-servicer', id, name]);
    }
    
  }

  vegetables(id) {
    this.navController.navigateForward(['/vegetables', id]);
  }

}
