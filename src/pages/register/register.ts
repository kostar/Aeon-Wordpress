import { Component } from '@angular/core';
import { IonicPage, ViewController, LoadingController, AlertController } from 'ionic-angular';

import { Register } from '../../models/user.model';
import { AuthProvider } from '../../providers/auth.provider';

@IonicPage()
@Component({
      selector: 'page-register',
      templateUrl: 'register.html'
})
export class RegisterPage {
      register: Register = new Register("", "", "", "", "");

      constructor(
            private auth: AuthProvider,
            private viewCtrl: ViewController,
            private loadingCtrl: LoadingController,
            private alertCtrl: AlertController
      ) { }

      ionViewWillLoad() {
            this.auth.getToken().then(res => {
                  if (res != null) {
                        this.dismiss();
                  }
            })
      }

      dismiss() {
            this.viewCtrl.dismiss();
      }

      submit() {
            let loader = this.loadingCtrl.create({
                  content: "Sign you up..."
            });
            loader.present();
            this.auth.register(this.register)
                  .subscribe(() => {
                        loader.dismiss();
                        this.dismiss();
                  },
                  err => {
                        loader.dismiss();
                        let alert = this.alertCtrl.create({
                              title: 'Login Error',
                              subTitle: 'Please check your username or password and try again.',
                              buttons: ['Dismiss']
                        });
                        alert.present();
                  })
      }
}
