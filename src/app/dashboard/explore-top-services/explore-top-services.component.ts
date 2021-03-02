import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-explore-top-services',
  templateUrl: './explore-top-services.component.html',
  styleUrls: ['./explore-top-services.component.scss'],
})
export class ExploreTopServicesComponent implements OnInit {
  public subCategories: any = [
    { name: 'Grocery', icon: '../../../assets/icon/grocry_small.svg' },
    { name: 'Medicine', icon: '../../../assets/icon/med_small.svg' },
    { name: 'Cabs', icon: '../../../assets/icon/cabs_small.svg' },
    { name: 'Appliance Repair', icon: '../../../assets/icon/reapir_small.svg' },
    { name: 'Wedding and Events', icon: '../../../assets/icon/events_small.svg' },
    { name: 'Online Services', icon: '../../../assets/icon/online_small.svg' },
  ];

  constructor(private navController:NavController) {}

  ngOnInit() {}

  gotoFood(){
    this.navController.navigateBack(['../food']);
  }
}
