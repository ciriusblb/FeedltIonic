import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';


/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello ToastProvider Provider');
  }
  createToast(message, duration) {
    this.toastCtrl.create({
      message: message,
      duration: duration
    }).present();
  }


}
