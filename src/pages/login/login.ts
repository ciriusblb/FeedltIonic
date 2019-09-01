import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import { FeedPage } from '../feed/feed';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  email: string = "cain@gmail.com";
  password: string = "123456";

  constructor(public navCtrl: NavController, public _userPvdr: UserProvider, public _toastPvdr: ToastProvider) {

  }
  goToSignUp() {
    this.navCtrl.push(SignupPage);
  }
  signIn() {
    this._userPvdr.signInWithEmailAndPassword(this.email, this.password)      
      .then((data) => {
        this._toastPvdr.createToast("Welcome " + data.user.displayName, 3000);
        this.navCtrl.setRoot(FeedPage)
      })
      .catch((err) => {
        this._toastPvdr.createToast(err.message, 3000);
      })
  }

}
