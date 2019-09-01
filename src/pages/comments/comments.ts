import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  
  post: any = {};
  comments: any[] = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    public _userPvdr: UserProvider,
    public viewCtrl: ViewController ) {
    this.post = this.navParams.get("post");
    this._userPvdr.getComments(this.post).then((data) => {
      this.comments = data.docs;
    }).catch((err) => {
      console.log(err);
    })
  }
  close(){
    this.viewCtrl.dismiss();
  }

}
