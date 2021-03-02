import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Platform,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  apiUrl: string = environment.urls.BASE_URL;
  envUrl: any = environment.urls;
  public loading :any;

  constructor(
    public alertController: AlertController,
    public _http: HttpClient,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public _mobileHttp: HTTP,
    public _platform: Platform
  ) {}

  async presentToastWithOptions(message, color?: any) {
    const toast = await this.toastController.create({
      color: color || 'success',
      duration: 3000,
      message: message,
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    await this.loading.present();
  }

  async stopLoading() {
    if(this.loading){
      console.log(100)
      await this.loading.dismiss();
    }
    
  }

  get isBrowser() {
    return this._platform.is('mobileweb') || this._platform.is('desktop');
  }


  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("jwt")
      }),
    };
    return httpOptions;

  }

  
  getLocations() {

    let obj = this;
    if (obj.isBrowser) {
      return obj._http
        .get(environment.urls.function.getLocations())
        .toPromise();
    } else {

      // this._mobileHttp.get( environment.urls.function.getLocations(), {}, {})
      //   .then(data => {
      //     console.log(data.status);
      //     console.log(data.data); // data received by server
      //     console.log(data.headers);
      //   })
      //   .catch(error => {
      //     console.log(error.status);
      //     console.log(error.error); // error message as string
      //     console.log(error.headers);

      //   });


      return this._mobileHttp.get(
        environment.urls.function.getLocations(),
        {},
        {}
      );
    }
  }

  getLogin(mobile): Promise<any> {
    
    let obj = this;
    if (obj.isBrowser) {
      return obj._http
        .post(environment.urls.function.getLogin(), mobile)
        .toPromise();
    } else {
      return this._mobileHttp.post(
        environment.urls.function.getLogin(),
        mobile,
        {}
      );
    }
  }

  signup(userData): Promise<any> {
    let obj = this;
    if (obj.isBrowser) {
      return obj._http
        .post(environment.urls.function.signUp(), userData)
        .toPromise();
    } else {
      return this._mobileHttp.post(
        environment.urls.function.signUp(),
        userData,
        {}
      );
    }
  }

  updateProfile(userData): Promise<any> {
    let obj = this;
    if (obj.isBrowser) {
      return obj._http
        .put(environment.urls.function.updateProfile(), userData)
        .toPromise();
    } else {
      
      return this._mobileHttp.put(
        environment.urls.function.updateProfile(),
        userData,
        this.getHeaders()
      );
    }
  }

  getOTP(mobile): Promise<any> {
    let obj = this;
    if (obj.isBrowser) {
      return obj._http
        .post(environment.urls.function.getOTP(), mobile)
        .toPromise();
    } else {
      return this._mobileHttp.post(
        environment.urls.function.getOTP(),
        mobile,
        {}
      );
    }
  }


}
