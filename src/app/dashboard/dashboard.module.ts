import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { ExploreTopServicesComponentModule } from './explore-top-services/explore-top-services.module';
import { SignupUserComponent } from '../profile/signup-user/signup-user.component';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ExploreTopServicesComponentModule,
    
  ],
  declarations: [DashboardPage, SignupUserComponent],
  providers:[Network]


})
export class DashboardPageModule {}
