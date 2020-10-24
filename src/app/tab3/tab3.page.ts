import { Component } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
      public loadingController: LoadingController,
      private router: Router,
      public alertController: AlertController
  ) {}

  loading: any;

  async presentLoading() {
    this.loading = await this.loadingController.create({
      duration: 0,
      message: 'Aguarde',
      translucent: true,
    });
    return this.loading.present();
  }

  async signOut(){
    await this.presentLoading();
    this.router.navigateByUrl('login');
    this.loading.dismiss();
  }

  async confirmSignOut(){
    const alert = await this.alertController.create({
      header: 'Deseja mesmo sair de sua conta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar'
        },
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
    await alert.present();
  }
}
