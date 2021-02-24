import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {ReportService} from '../report/report.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  loading: any;

  constructor(
      public alertController: AlertController,
      public loadingController: LoadingController,
      public http: HttpClient,
      public reportService: ReportService,
  ) { }

  ngOnInit() {
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

  async signOut(){
    await this.presentLoading();

    this.reportService.user = [];
    this.reportService.storage.remove('user');
    this.reportService.reports = [];

    await this.loading.dismiss();

    setTimeout(() => {
      location.reload();
    }, 500);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      duration: 0,
      message: 'Aguarde',
      translucent: true,
    });
    return this.loading.present();
  }
}
