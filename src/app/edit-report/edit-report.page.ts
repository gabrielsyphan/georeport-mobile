import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ReportService} from '../report/report.service';
import {ModalController, NavParams} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit-report',
  templateUrl: './edit-report.page.html',
  styleUrls: ['./edit-report.page.scss'],
})
export class EditReportPage implements OnInit {
  public reportId: any;
  public reportData: any;
  public reportImage: any;

  constructor(
      private router: Router,
      public reportService: ReportService,
      public navParams: NavParams,
      public modalController: ModalController,
      public camera: Camera
  ) {
    this.reportId = navParams.get('id');
  }

  ngOnInit() {
    this.reportService.reports.forEach((report) => {
      if (report.id === this.reportId) {
        this.reportData = report;
        // tslint:disable-next-line:radix
        this.reportData.type = parseInt(this.reportData.type);
        this.reportImage = this.reportData.image;
      }
    });
  }

  closePage() {
    this.modalController.dismiss();
  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.reportImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.reportService.alertBox('Erro!', 'Não foi possivel acessar a camera. ');
    });
  }

  async removePicture() {
    this.reportImage = '';
  }

  async updateReport() {
    await this.reportService.presentLoading();
    let type = (document.getElementById('type') as HTMLInputElement).value;
    let title = (document.getElementById('title') as HTMLInputElement).value;
    let process = (document.getElementById('process') as HTMLInputElement).value;
    let date = (document.getElementById('date') as HTMLInputElement).value;
    let description = (document.getElementById('description') as HTMLInputElement).value;

    if (!this.reportImage) {
      this.reportImage = this.reportData.image;
    }

    if (!type) {
      type = this.reportData.type;
    }

    if (!title) {
      title = this.reportData.title;
    }

    if (!process) {
      process = this.reportData.process;
    }

    if (!date) {
      date = this.reportData.date;
    }

    if (!description) {
      description = this.reportData.description;
    }

    await this.reportService.updateReport (this.reportId, type, title, process, date, description, this.reportImage);
  }
}
