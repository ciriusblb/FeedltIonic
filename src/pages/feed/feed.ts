import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import moment from 'moment';
import { LoginPage } from '../login/login';
import { CommentsPage } from '../comments/comments';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage implements OnInit{
  text: string = "";
  image: string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public _userPvdr: UserProvider, 
    public _toastPvdr: ToastProvider,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public modalCtrl: ModalController ) {
      // this.getTokenCordova();
  }
  ngOnInit(){
    this._userPvdr.getDocuments().subscribe();
  }
  // getTokenCordova(){
  //   this._userPvdr.getTokenCordova().then((token)=> {
  //     console.log(token);
  //     this._userPvdr.updateToken(token)
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }

  addDocument() {
    this._userPvdr.addDocument(this.text)
      .then((doc) => {
        this._toastPvdr.createToast("docuemento creado", 3000);
        if(this.image){
          this._userPvdr.upload(doc.id, this.image);
        }
        this.image =undefined;
        this.text ="";
      }).catch((err) => {
        this._toastPvdr.createToast(err.message, 3000);
      })
  }
  loadMoreDocuments(event) {
    this._userPvdr.loadMoreDocuments(event).subscribe();
  }
  ago(time) {
    let difference = moment(time.nanoseconds).diff(moment());
    return moment.duration(difference).humanize();
  }
  refresh(event) {
    this._userPvdr.getDocuments().subscribe();
    this._userPvdr.refresh(event);
  }
  addPhoto() {
    this._userPvdr.addPhoto().then((base64Image) => {
      console.log(base64Image);
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }
  like(post){
    this._userPvdr.like(post).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }
  comment(doc){
    this.actionSheetController.create({
      buttons: [
        {
          text: "View All Comments",
          handler: () => {
            this.modalCtrl.create(CommentsPage, {
              "post": doc
            }).present();
          }
        },
        {
          text: "New Comment",
          handler: () => {
            this.alertController.create({
              title: "New Comment",
              message: "Type your Comment",
              inputs: [
                {
                  name: "comment",
                  type: "text"
                }
              ],
              buttons: [
                {
                  text: "Cancel"
                },
                {
                  text: "Post",
                  handler: (data) => {
                    console.log(data);
                    if(data.comment) {
                      this._userPvdr.addComment(data.comment, doc)
                        .then((doc) => {
                          this._toastPvdr.createToast("Comment posted successfully", 3000);
                        }).catch((err) => {
                          this._toastPvdr.createToast(err.message, 3000);
                        })
                    }
                  }
                }
              ]
            }).present();
          }
        }
      ]
    }).present();
  }

  logout() {
    this._userPvdr.logout().then(() => {
      this._toastPvdr.createToast("cerraste sesión", 3000);
      this.navCtrl.setRoot(LoginPage);
    })
  }

}
