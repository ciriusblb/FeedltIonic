import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import { AlertProvider } from '../../providers/alert/alert';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  name: string = "Ciro";
  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public afAuth: AngularFireAuth, 
    public _userPvdr: UserProvider,
    public _toastPvdr: ToastProvider,
    public _alertPvdr: AlertProvider) {
  }
  goBack() {
    this.navCtrl.pop();
  }
  signUp() {
    this._userPvdr.createUserWithEmailAndPassword(this.email, this.password)
      .then((data) => {
        let user: firebase.User = data.user;
        this._userPvdr.updateProfile(user, {name: this.name}).then(() => {
          this._alertPvdr.createAlert(this.email);
          this.navCtrl.pop();
        }).catch((err) => {
          this._toastPvdr.createToast(err.message, 3000);
        })
      })
  }
}
