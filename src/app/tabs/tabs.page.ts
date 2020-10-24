import { Component } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ReportService} from '../report/report.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  loading: any;

  constructor(
      public alertController: AlertController,
      public loadingController: LoadingController,
      private router: Router,
      public http: HttpClient,
      public reportService: ReportService,
  ) {}

  async createReport(){
    this.reportService.closeMenu();
    this.router.navigateByUrl('createReport');
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
    this.reportService.reports = [];
    this.router.navigateByUrl('login');
    this.loading.dismiss();
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
