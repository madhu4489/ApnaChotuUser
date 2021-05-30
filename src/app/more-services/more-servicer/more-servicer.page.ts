import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-more-servicer',
  templateUrl: './more-servicer.page.html',
  styleUrls: ['./more-servicer.page.scss'],
})
export class MoreServicerPage implements OnInit {

  categories:any = [];
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getEnabledCategories(this.route.snapshot.params.id);
  }
  backHandler() {
    this.navController.navigateBack(['../dashboard']);
  }

  getEnabledCategories(id) {
    this.sharedService.getSubCategories(id).then((data) => {
      //console.log(data, 'data:::');
      this.categories = data['data'];
    });
  }
  buttonClick(){
    window.open(`tel:` + '9150915084', '_system');
  }
}
