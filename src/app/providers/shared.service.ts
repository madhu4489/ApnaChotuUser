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
  public loading: any;

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
      spinner: 'bubbles',
    });
    await this.loading.present();
  }

  async stopLoading() {
    if (this.loading) {
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
        Authorization: localStorage.getItem('jwt'),
      }),
    };
    return httpOptions;
  }

  getToken(){
    return localStorage.getItem('jwt')
  }
  getLocations() {
    let obj = this;
    if (obj.isBrowser) {
      return obj._http
        .get(environment.urls.function.getLocations())
        .toPromise();
    } else {
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
        .post(environment.urls.function.getLogin(), mobile, {
          observe: "response"
        })
        .toPromise();
    } else {
      return this._mobileHttp.post(
        environment.urls.function.getLogin(),
        mobile,
        {},
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

    return obj._http
        .put(environment.urls.function.updateProfile(), userData, this.getHeaders())
        .toPromise();
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

  getRestaurants(details): Promise<any> {
    let obj = this;
      return obj._http
        .post(environment.urls.function.getRestaurants(), details)
        .toPromise();
  }

  getRestaurantVendor(id:any): Promise<any> {
    let obj = this;
    return obj._http
    .get(environment.urls.function.getRestaurantVendor()+"/"+id)
    .toPromise();
  }

  getAllAddress(): Promise<any> {
    let obj = this;
    return obj._http
    .get(environment.urls.function.getAllAddres(), this.getHeaders())
    .toPromise();
  }

  addAddress(userData): Promise<any> {
    let obj = this;
      return obj._http
        .post(environment.urls.function.addAddres(), userData, this.getHeaders())
        .toPromise();
  }

  updateAddress(userData): Promise<any> {
    let obj = this;
      return obj._http
        .put(environment.urls.function.updateAddres(), userData, this.getHeaders())
        .toPromise();
   
  }

  deleteAddress(userData): Promise<any> {
    let obj = this;
      return obj._http
        .delete(environment.urls.function.deletetAddres()+'/'+userData, this.getHeaders())
        .toPromise();
   
  }


  createOrder(details): Promise<any> {
    let obj = this;
      return obj._http
        .post(environment.urls.function.createOrder(), details, this.getHeaders())
        .toPromise();
  }

  createMiscOrder(details): Promise<any> {
    let obj = this;
      return obj._http
        .post(environment.urls.function.createMiscOrder(), details, this.getHeaders())
        .toPromise();
  }

  getSubCategories(id): Promise<any> {
    let obj = this;
    return obj._http
    .get(environment.urls.function.getSubCategories()+'/'+id)
    .toPromise();
  }

  
  getOrdersAll(details): Promise<any> {
    let obj = this;
      return obj._http
        .post(environment.urls.function.getOrdersAll(), details, this.getHeaders())
        .toPromise();
  }
  
  getSingleOrderDetails(id): Promise<any> {
    let obj = this;
      return obj._http
        .get(environment.urls.function.getSingleOrderDetails()+id, this.getHeaders())
        .toPromise();
  }

  

  getDashboardOffers(): Promise<any> {
    let obj = this;
      return obj._http
        .get(environment.urls.function.getDashboardOffers())
        .toPromise();
  }


}
