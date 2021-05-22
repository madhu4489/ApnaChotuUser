import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.scss'],
})
export class SignupUserComponent implements OnInit {
  @Input() isEditMode = null;
  @Input() storedUserDetails = null;
  @Input() isFromPage = null;

  loginGroup: FormGroup;

  otpGroup: FormGroup;

  signupGroup: FormGroup;
  userResponceToken: any;

  switchOTPScreen: boolean;
  isSignUpScreen: boolean;
  isLoginScreen: boolean = true;
  saveOTP: string = '';
  otpGroupErrors: boolean;

  userDetails: any;

  userPhone: any;

  isFrom: any;

  mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  regix = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


  constructor(
    public navController: NavController,
    private _modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    public loader: LoadingController,
    private firebaseX: FirebaseX,
  ) {
    this.loginGroup = this.formBuilder.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });

    this.otpGroup = this.formBuilder.group({
      otp: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });

    this.signupGroup = this.formBuilder.group({
      name: [''],
      lastName: [''],
      email: ['', [this.ValidateEmail]],
    });
  }

  get f() {
    return this.signupGroup.controls;
  }

  ValidateEmail(control: AbstractControl): { [key: string]: any } | null {

    let mailformat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (control.value && (!mailformat.test(control.value))) {
      return { emailInvalid: true };
    }


    return null;
  }

  ngOnInit() {
    console.log(this.isEditMode);

    if (this.isEditMode) {
      this.isSignUpScreen = true;
      this.isLoginScreen = false;
      this.f.lastName.setValue(this.storedUserDetails.last_name);
      this.f.name.setValue(this.storedUserDetails.first_name);
      this.f.email.setValue(this.storedUserDetails.email);
    }else{
      console.log('loginininnnnn')
      this.initializeApp();
    }
    // this.sharedService.presentLoading();
  }

  backHandler() {
    this._modalCtrl.dismiss();
    // this.navController.navigateBack(['../dashboard']);
  }

  async logForm() {
    let mobileNum = { mobile: Number(this.loginGroup.value.phone) };
    // this.sharedService.presentLoading();

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.getLogin(mobileNum).then((resp) => {
        loading.dismiss();
        this.userPhone = this.loginGroup.value.phone;
        let values = this.loginGroup.value;

        let details = {
          first_name: 'Guest',
          last_name: 'Guest',
          email: values.email && (values.email).toLowerCase(),
          user_role: 'USER',
          mobile: values.phone,
          password: null,
          privilege: 'read',
          gender: "notchoose"
        };
  
        let serverData: any;
        let serverHeader: any;
  
        if (!this.sharedService.isBrowser) {
          serverData = resp.data;
          serverHeader = resp.headers;
          serverData = JSON.parse(serverData).data;
          this.userResponceToken = 'Bearer ' + serverHeader.token;
          console.log(this.userResponceToken, 'this.userResponceToken');
  
          if (serverData) {
            this.userDetails = serverData;
            this.calcOTP();
          } else {
            this.signUp(details);
          }
  
        } else {
          serverData = resp.body;
          if (serverData.status == 'error') {
            this.signUp(details);
        
          } else {
            this.userResponceToken = 'Bearer ' + resp.headers.get('token');
            this.userDetails = serverData.data;
            this.calcOTP();
          }
        }
  
      });
    });
    


  }

  calcOTP() {
    let mobileNum = { mobile: Number(this.userPhone) };
    this.sharedService.getOTP(mobileNum).then((data) => {
      let serverData = data.data;
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }
      if (serverData) {
        this.sharedService.stopLoading();
        this.isSignUpScreen = false;
        this.isLoginScreen = false;
        this.switchOTPScreen = true;
        this.saveOTP = serverData.otp;
        // this.otpGroup.value.otp = serverData.otp;
        console.log(this.saveOTP, 'this.saveOTP');
      }
    });
  }

  signUp(details, isFrom?: any) {
    this.sharedService.signup(details).then((data) => {
      console.log(data, 'signUp');
      let serverData = data.data;
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }
      if (serverData) {
        this.userDetails = serverData;
        if (!isFrom) {
        this.extraLogin()
        } else {
          localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
          this._modalCtrl.dismiss();
        }
      }
    });
  }

  verifyOTP() {
    if (this.otpGroup.value.otp == this.saveOTP) {
      this.otpGroupErrors = false;
      localStorage.setItem('jwt', this.userResponceToken);

      let tokanData ={
        "deviceToken":JSON.parse(localStorage.getItem('deviceToken')),
        "deviceId":localStorage.getItem('deviceId'),
        "mobile":this.userPhone
      }
      console.log(tokanData, "tokanData::::");
      this.sharedService.addToken(tokanData).then((data) => {
        this.sharedService.presentToastWithOptions(
          'You have successfully logged in...',
          'success'
        );
       
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        this._modalCtrl.dismiss();

      });

      if (this.isFromPage) {
        this.navController.navigateBack(['/' + this.isFromPage]);
      }
      
    } else {
      this.otpGroupErrors = true;
    }
  }

  submitForm() {
    if (this.isLoginScreen) {
      this.logForm();
    } else if (this.isSignUpScreen) {
      let details = {
        first_name: this.f.name.value || 'Guest',
        last_name: this.f.lastName.value || 'Guest',
        email: (this.f.email.value).toLowerCase() || '',
        gender: "notchoose"
        
      };
      this.updateProfile(details);
    } else if (this.switchOTPScreen) {
      this.verifyOTP();
    }
  }

  isDisabled() {
    if (this.isLoginScreen) {
      return !this.loginGroup.valid;
    } else if (this.isSignUpScreen) {
      return !this.signupGroup.valid;
    } else if (this.switchOTPScreen) {
      return !this.otpGroup.valid;
    }
  }

  editScreen() {
    this.switchOTPScreen = false;
    if (this.isFrom == 'signUp') {
      this.isSignUpScreen = true;
    } else if (this.isFrom == 'login') {
      this.isLoginScreen = true;
    }
  }

  resendOTP() {
    this.sharedService.presentLoading();
    this.calcOTP();
  }

  async updateProfile(details) {

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.sharedService.updateProfile(details).then((data) => {
        loading.dismiss();
        console.log(data, "datadatadatadatadatadatadatadatadatadatadatadata signup update");
        let serverData = data;
        let msg = data.message;

        // if (!this.sharedService.isBrowser) {
        //   serverData = JSON.parse(serverData).data;
        //   msg = serverData.message;
        // }

        if (serverData.status == 'success') {
          this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
          this.userDetails.first_name = details.first_name;
          this.userDetails.last_name = details.last_name;
          this.userDetails.email = (details.email).toLowerCase();
          this.userDetails.gender = "notchoose";
          localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
          this.sharedService.presentToastWithOptions(
            msg,
            'success'
          );
          this._modalCtrl.dismiss();
        }
      });

      

    });



    
  }


  extraLogin(){
    let mobileNum = { mobile: Number(this.userPhone) };
    this.sharedService.getLogin(mobileNum).then((resp) => {
      let serverData: any;
      let serverHeader: any;

      if (!this.sharedService.isBrowser) {
        serverData = resp.data;
        serverHeader = resp.headers;
        serverData = JSON.parse(serverData).data;
        this.userResponceToken = 'Bearer ' + serverHeader.token;
        console.log(this.userResponceToken, 'this.userResponceToken');

        if (serverData) {
          this.userDetails = serverData;
          this.calcOTP();
        } 

      } else {
        serverData = resp.body;
        if (serverData.status == 'error') {
        } else {
          this.userResponceToken = 'Bearer ' + resp.headers.get('token');
          this.userDetails = serverData.data;
          this.calcOTP();
        }
      }


    });
  }


  async initializeApp() {
  

    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present().then(() => {
      this.firebaseX.setAutoInitEnabled(true)
      .then((token) =>{
        console.log("Auto init has been disabled ", token);
        this.firebaseX.unregister();
      }).catch(error => console.error('Error getting token', error));


     
      this.firebaseX.onTokenRefresh()
        .subscribe((token: string) => {
          loading.dismiss();
          if(token){
            localStorage.setItem("deviceId", "2qwaskjbdf67t67d");
            console.log(`onTokenRefresh ${JSON.stringify(token)}`)
            localStorage.setItem("deviceToken", JSON.stringify(token))
          }
        });


    })
    // this.firebaseX.unregister();
   




    // this.firebaseX.getToken()
    // .then(token =>{
    //   console.log(token, "token ID getToken");
    //   if(token){
    //     localStorage.setItem("deviceToken", JSON.stringify(token));
    //   }
    // }).catch(error => console.error('Error getting token', error));


   

      
   
  }


}
