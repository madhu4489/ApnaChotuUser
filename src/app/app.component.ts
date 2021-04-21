import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private navController: NavController, private network: Network) {}

  ngOnInit() {
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.navController.navigateRoot(['./no-connection']);
    });
  }
}
