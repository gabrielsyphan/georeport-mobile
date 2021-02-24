import {Component, OnInit} from '@angular/core';
import { ReportService } from '../report/report.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {ModalController, NavController} from '@ionic/angular';
import { MyReportDataPage } from '../my-report-data/my-report-data.page';
import { EditReportPage } from '../edit-report/edit-report.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  public reports: any;

  constructor(
      public reportService: ReportService,
      public http: HttpClient,
      public navCtrl: NavController,
      public modalController: ModalController,
      private router: Router
  ) {}

  async ngOnInit(event?) {
    await this.reportService.loadSaved();

    if (event) {
      event.target.complete();
    }
  }

  async openReportData(reportId) {
    this.modalController.create({
      component: MyReportDataPage,
      componentProps: {
        'id': reportId
      }
    }).then((modalElement) => {
      modalElement.present();
    });
  }

  createNewReport() {
    this.router.navigateByUrl('createReport');
  }

  openEditReport(reportId) {
    this.modalController.create({
      component: EditReportPage,
      componentProps: {
        'id': reportId
      }
    }).then((modalElement) => {
      modalElement.present();
    });
  }

  sendTextBox() {
    this.reportService.alertBox('Alerta!', 'Essa denúncia já foi enviada.');
  }

  searchReport(e) {
    const val = (e.target.value).toLowerCase();
    const items = Array.from(document.querySelector('ion-item-sliding').children);
    // tslint:disable-next-line:triple-equals
    if (val && val.trim() != '') {
      items.forEach(item => {
        console.log(item);
        const label = item.querySelector('p');
        const shouldShow = label.textContent.toLowerCase().indexOf(val) > -1;
        // @ts-ignore
        item.style.display = shouldShow ? 'block' : 'none';
      });
    }else{
      items.forEach(item => {
        const options = item.querySelector('ion-item-option');
        // @ts-ignore
        item.style.display = 'block';
        options.style.display = 'none';
      });
    }
  }

  doRefresh(event) {
    this.ngOnInit(event);
  }
}
