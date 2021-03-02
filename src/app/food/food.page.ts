import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {

  constructor(private navController:NavController) { }

  ngOnInit() {
  }

  backHandler(){
    this.navController.navigateBack(['/dashboard']);
  }
 
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
}
