import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { CheckConnectivity } from '../providers/check-connectivity/check-connectivity-service';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.page.html',
  styleUrls: ['./no-connection.page.scss'],
})
export class NoConnectionPage implements OnInit {

  constructor( public loader: LoadingController, private network: CheckConnectivity,  private navController: NavController,) { }

  ngOnInit() {
  }

  async checkCOnnection(){

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      if(!this.network.noConnection()){
        loading.dismiss();
        this.navController.navigateRoot(['../dashboard']);
      }else{
        loading.dismiss();
      }
    },
    (error) => {
      console.error(error.message);
      loading.dismiss();
    });

  

   

  }

  callContact() {
    window.open(`tel:` + 9150915084, '_system');
  }


}
