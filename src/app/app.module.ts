import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { UserProvider } from '../providers/user/user';
import { ToastProvider } from '../providers/toast/toast';
import { AlertProvider } from '../providers/alert/alert';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FeedPage } from '../pages/feed/feed';
import { CommentsPage } from '../pages/comments/comments';
var config = {
  apiKey: "AIzaSyAD0EnhU5xDrH-d_AirR-pR8xkjy_nYq6k",
  authDomain: "feedly-31e6d.firebaseapp.com",
  databaseURL: "https://feedly-31e6d.firebaseio.com",
  projectId: "feedly-31e6d",
  storageBucket: "feedly-31e6d.appspot.com",
  messagingSenderId: "908064099686"
};
// firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage,
    CommentsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage,
    CommentsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    ToastProvider,
    AlertProvider,
    Camera,
    Firebase
  ]
})
export class AppModule {}
