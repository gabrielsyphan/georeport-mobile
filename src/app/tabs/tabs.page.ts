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
    // this.router.navigateByUrl('login');
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      duration: 0,
      message: 'Aguarde',
      translucent: true,
    });
    return this.loading.present();
  }

  createReport(){
    this.reportService.closeMenu();
    this.router.navigateByUrl('createReport');
  }

  mapPage() {
    this.reportService.closeMenu();
    this.router.navigateByUrl('');
  }

  myReports() {
    this.reportService.closeMenu();
    this.router.navigateByUrl('tab2');
  }

  listReports() {
    this.reportService.closeMenu();
    this.router.navigateByUrl('listReports');
  }

  webChat() {
    this.reportService.closeMenu();
    this.router.navigateByUrl('webchat');
  }
}
