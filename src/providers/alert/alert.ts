import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';


/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(public alertCtrl: AlertController) {
    console.log('Hello AlertProvider Provider');
  }
  createAlert(email) {
    return this.alertCtrl.create({
      title: "Cuenta creada",
      message: "La cuenta "+ email + " fue creada exitósamente",
      buttons: [
        {
          text: "OK",
          handler: () => {
            return true;
          }
        }
      ]
    }).present();
  }

}
