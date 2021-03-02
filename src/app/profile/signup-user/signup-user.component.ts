import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.scss'],
})
export class SignupUserComponent implements OnInit {
  @Input() isEditMode = null;
  @Input() storedUserDetails = null;

  loginGroup: FormGroup;

  otpGroup: FormGroup;

  signupGroup: FormGroup;
  userResponceToken:any;

  switchOTPScreen: boolean;
  isSignUpScreen: boolean;
  isLoginScreen: boolean = true;
  saveOTP: string = '';
  otpGroupErrors: boolean;

  userDetails: any;

  userPhone: any;

  isFrom: any;

  constructor(
    public navController: NavController,
    private _modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public sharedService: SharedService
  ) {
    this.loginGroup = this.formBuilder.group({
      phone: [
        '9963887640',
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
    let regix = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (control.value && !regix.test(control.value)) {
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
    }
    // this.sharedService.presentLoading();
  }

  backHandler() {
    this._modalCtrl.dismiss();
    // this.navController.navigateBack(['../dashboard']);
  }

  logForm() {
    let mobileNum = { mobile: Number(this.loginGroup.value.phone) };
    this.sharedService.presentLoading();
    this.sharedService.getLogin(mobileNum).then((data) => {
      console.log(data, 'login');
      this.userPhone = this.loginGroup.value.phone;

      let serverData = data.data;
      let serverHeader = data.headers;
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
        this.userResponceToken = 'Bearer ' + serverHeader.token;
        console.log(this.userResponceToken, "this.userResponceToken");
      }

      if (serverData) {
        this.userDetails = serverData;
        this.calcOTP();
      } else {
        let values = this.loginGroup.value;
        let details = {
          first_name: 'Guest',
          last_name: 'Guest',
          email: values.email,
          user_role: 'USER',
          mobile: values.phone,
          password: null,
          privilege: 'read',
        };
        this.signUp(details);
        this.sharedService.presentToastWithOptions(
          serverData.message,
          'warning'
        );
      }
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
        console.log(this.saveOTP, 'this.saveOTP');
      }
    });
  }

  signUp(details, isFrom?:any) {
    this.sharedService.signup(details).then((data) => {
      console.log(data, 'signUp');
      let serverData = data.data;
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }
      if (serverData) {
        this.userDetails = serverData;
        if(!isFrom){
          this.calcOTP();
        }else{
          this.sharedService.presentToastWithOptions(
            'Updated successfully.',
            'success'
          );
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
      this.sharedService.presentToastWithOptions(
        'You have successfully logged in...',
        'success'
      );
      // let serverData= this.userDetails;
      // if (this.sharedService.isBrowser) {
      //   serverData = JSON.stringify(serverData);
      // }
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
      this._modalCtrl.dismiss();
    } else {
      this.otpGroupErrors = true;
    }
  }

  submitForm() {
    if (this.isLoginScreen) {
      this.logForm();
    } else if (this.isSignUpScreen) {
      let details = {
        first_name:this.f.name.value || 'Guest',
        last_name: this.f.lastName.value || 'Guest',
        email: this.f.email.value || 'Guest',
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

  updateProfile(details){
    this.sharedService.presentLoading();
    this.sharedService.updateProfile(details).then((data) => {
      let serverData = data.data;
      if (!this.sharedService.isBrowser) {
        serverData = JSON.parse(serverData).data;
      }
      if (serverData) {
        this.sharedService.stopLoading();
        this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
        this.userDetails.first_name = details.first_name;
        this.userDetails.last_name = details.last_name;
        this.userDetails.email = details.email;
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        this.sharedService.presentToastWithOptions(
          'Updated successfully.',
          'success'
        );
       this._modalCtrl.dismiss();
      }
    })
  }
  
}
