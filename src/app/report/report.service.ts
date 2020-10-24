import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {AlertController, LoadingController} from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public reports: Report[] = [];
  public ids: Id[] = [];
  public loading: any;
  public user: User[] = [];

  constructor(
      public http: HttpClient,
      public storage: Storage,
      public loadingController: LoadingController,
      public alertController: AlertController,
      public menu: MenuController,
      public geolocation: Geolocation
  ) { }

  async loadSaved(){
    this.storage.get('reports').then((reports) => {
      reports.forEach((report) => {
        if (report.registration == this.user[0].registration) {
          this.reports.push(report);
        }
      });
    });

    this.idCount();
  }

  async newReport(data) {
    this.geolocation.getCurrentPosition().then((resp) => {
      const reportId = this.idCount();

      this.ids.push({
        id: 1
      });

      this.reports.push({
        id: reportId,
        subtype: data.type,
        title: data.title,
        process: data.process,
        date: data.date,
        description: data.description,
        image: data.image,
        sent: 0,
        registration: this.user[0].registration,
        organ: this.user[0].organ,
        name: this.user[0].name,
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude,
        accuracy: resp.coords.accuracy,
        type : 51
      });

      this.storage.set('reports', this.reports).then((reports) => {
        this.loading.dismiss();
        this.alertBox('Sucesso!', 'Denúncia cadastrada.');
      });

      this.storage.set('id', this.ids);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async sendReport(reportId) {
    await this.presentLoading();

    const auxReports = Object.values(this.reports);
    auxReports.forEach((report, i) => {
      if (report.id === reportId){
        const link = 'https://semecmaceio.com/maceio-geo/json/maceiogeoreports.php';
        const myData = {
          organ: report.organ,
          registration: report.registration,
          date: report.date,
          image: report.image,
          process: report.process,
          latitude: report.latitude,
          longitude: report.longitude,
          accuracy: report.accuracy,
          type: report.type,
          description: report.description,
          title: report.title,
          subtype: report.subtype
        };

        this.http.post(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
            .subscribe(dataFromService => {
              // tslint:disable-next-line:triple-equals
              // @ts-ignore
              if(dataFromService.status == 1) {
                report.sent = 1;
                this.reports = Object.values(auxReports);
                this.storage.set('reports', this.reports).then((reports) => {
                  this.loading.dismiss();
                  this.alertBox('Sucesso!', 'A denúncia foi enviada.');
                });
              }
              // tslint:disable-next-line:no-unused-expression
            }), err => {
              this.alertBox('Erro!', 'Não foi possivel cadastrar os dados.');
        };
      }
    });

    this.loading.dismiss();
  }

  async deleteReport(reportId) {
    await this.presentLoading();

    const auxReports = Object.values(this.reports);
    auxReports.forEach((report, i) => {
      if (report.id === reportId){
        delete auxReports[i];
        this.reports = Object.values(auxReports);
        this.storage.remove('reports');
        this.storage.set('reports', this.reports).then((reports) => {
          this.loading.dismiss();
          this.alertBox('Sucesso!', 'A denúncia foi apagada.');
        });
      }
    });

    this.loading.dismiss();
  }

  idCount() {
    this.storage.get('id').then((id) => {
      this.ids = id || [];
    });

    const flen = this.ids.length;
    return flen + 1;
  }

  async updateReport(reportId, type, title, process, date, description, image) {
    this.reports.forEach ((report) => {
      if (report.id === reportId) {
        report.type = type;
        report.title = title;
        report.process = process;
        report.date = date;
        report.description = description;
        report.image = image;
      }
    });

    await this.storage.set ('reports', this.reports);
    this.loading.dismiss();
    this.alertBox('Sucesso!', 'A denúncia foi atualizada.');
  }

  async loginUser(registration, name, organ){
    await this.user.push({
      registration,
      name,
      organ
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      duration: 0,
      message: 'Aguarde',
      translucent: true,
    });
    return this.loading.present();
  }

  async alertBox(header, message) {
    const alert = await this.alertController.create({
      header: '' + header,
      message: '' + message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async openMenu() {
    this.menu.open('end');
  }

  async closeMenu() {
    this.menu.close('end');
  }

  async confirmDeleteReport(reportId){
    const alert = await this.alertController.create({
      header: 'Alerta!',
      message: 'Deseja mesmo apagar a denúncia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar'
        },
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: () => {
            this.deleteReport(reportId);
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmSendReport(reportId){
    const alert = await this.alertController.create({
      header: 'Alerta!',
      message: 'Deseja mesmo enviar essa denúncia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar'
        },
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: () => {
            this.sendReport(reportId);
          }
        }
      ]
    });
    await alert.present();
  }
}

class Report {
  id: any;
  subtype: any;
  title: any;
  process: any;
  date: any;
  description: any;
  image: any = [];
  sent: any;
  registration: any;
  organ: any;
  name: any;
  latitude: any;
  longitude: any;
  accuracy: any;
  type: any;
}

class Id {
  id: any;
}

class User {
  registration: any;
  organ: any;
  name: any;
}

