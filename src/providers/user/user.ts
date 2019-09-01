import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastProvider } from '../toast/toast';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Doc } from '../../interface/doc.interface';
import { map, takeUntil } from 'rxjs/operators';
import { LoadingController, ActionSheetController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertProvider } from '../alert/alert';
import { Firebase } from '@ionic-native/firebase/ngx';


@Injectable()
export class UserProvider {
  private docsCollection: AngularFirestoreCollection<Doc>;
  public docs: Doc[] = [];
  public nextdocs: Doc[] = [];

  
  pageSize: number = 4;
  cursor: any;
  infiniteEvent: any;
  private ngUnsubscribe$: Subject<void> = new Subject();
  constructor(public http: HttpClient, 
    public afAuth: AngularFireAuth, 
    public _toastPvdr: ToastProvider, 
    public _alertPvdr: AlertProvider,
    public afFirestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private firebaseCordova: Firebase) {

    const settings = { timestampsInSnapshots: true };
    afFirestore.firestore.settings( settings );
    afFirestore.firestore.enablePersistence();
  }

  // getTokenCordova(){
  //   return this.firebaseCordova.getToken();
  // }
  // updateToken(token: string){
  //   let uid = firebase.auth().currentUser.uid;
  //   this.afFirestore.collection("users").doc(uid).set({
  //     token: token,
  //     tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
  //   }, {
  //     merge: true
  //   }).then(() => {
  //     console.log("token saved to cloud firestore");
  //   }).catch(err => {
  //     console.log(err);
      
  //   })
  // }

  signInWithEmailAndPassword(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
  }
  createUserWithEmailAndPassword(email, password){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  updateProfile(user: firebase.User, data){
    return user.updateProfile({
      displayName: data.name,
      photoURL: ""
    });
  }
  getDocuments() {
    let loading = this.loadingCtrl.create({
      content: "loading feed..."
    });
    loading.present();
    this.docsCollection = this.afFirestore.collection<Doc>('posts', ref => ref.orderBy('created', 'desc').limit(this.pageSize));
    return this.docsCollection.snapshotChanges().pipe(takeUntil(this.ngUnsubscribe$), map(actions => {
      this.docs = actions.map(a => {
        const data = a.payload.doc.data() as Doc;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
      this.cursor = this.docs[this.docs.length -1];
      loading.dismiss();
    }));
    // return this.docsCollection.valueChanges().pipe(takeUntil(this.ngUnsubscribe$), map((docs: Doc[]) => {
    //   this.docs = docs;
    //   this.cursor = this.docs[this.docs.length -1];
    //   loading.dismiss();
    // }));
  }
  getComments(post){
    return this.afFirestore.firestore.collection("comments").where("post", "==", post.id).get();
  }
  loadMoreDocuments(event) {
    this.docsCollection = this.afFirestore.collection<Doc>('posts', ref => ref.orderBy('created', 'desc').startAfter(this.cursor.created).limit(this.pageSize));
    return this.docsCollection.snapshotChanges().pipe(takeUntil(this.ngUnsubscribe$), map(actions => {  
      this.nextdocs = actions.map(a => {
        const data = a.payload.doc.data() as Doc;
        const id = a.payload.doc.id;
        return { id, ...data };
      });      
      this.nextdocs.forEach((doc) => {
        this.docs.push(doc);
      })
      if (this.nextdocs.length < this.pageSize) {
        event.enable(false);
        this.infiniteEvent = event;
      } else {
        event.complete();
        this.cursor = this.docs[this.docs.length -1];
      }
      this.nextdocs=[];
    }));
  }
  addDocument(text: string) {
    return this.afFirestore.collection('posts').add({
      text: text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: this.afAuth.auth.currentUser.uid,
      owner_name: this.afAuth.auth.currentUser.displayName
    });
  }
  refresh(event) {
    if(this.infiniteEvent){
      this.infiniteEvent.enable(true);
    }
    event.complete();
  }
  addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    }; 
    return this.camera.getPicture(options);
  }
  upload(name: string, image: string) {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      });
      loading.present();
      let ref = firebase.storage().ref("postImages/" + name);
      let uploadTask = ref.putString(image.split(',')[1], "base4");
      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        const porcentaje = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loading.setContent("uploaded "+ porcentaje+ "% ...");
      }, (error) => {
        console.log(error);
      }, () => {
        console.log("the upload is complete");
        uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
          firebase.firestore().collection("posts").doc(name).update({
            image: url
          }).then(() => {
            loading.dismiss();
            resolve();
          }).catch((err) => {
            loading.dismiss();
            reject();
          })
        }).catch((err) => {
          loading.dismiss();
          reject();
        })
      })     
    })

  }
  like(post) {
    console.log("post ", post );
    let body = {
      postId: post.id,
      userId: this.afAuth.auth.currentUser.uid,
      action: post.likes && post.likes[this.afAuth.auth.currentUser.uid] == true ? "unlike" : "like"
    }
    console.log("body", body);
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post("https://us-central1-feedly-31e6d.cloudfunctions.net/updateLikesCount", body, {
      headers: headers,
      responseType: "text"
    });
  }
  addComment(comment: string, post){
    return this.afFirestore.collection("comments").add({
      text: comment,
      post: post.id,
      owner: this.afAuth.auth.currentUser.uid,
      owner_name: this.afAuth.auth.currentUser.displayName,
      created: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  logout() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    return this.afAuth.auth.signOut();
  }

}
