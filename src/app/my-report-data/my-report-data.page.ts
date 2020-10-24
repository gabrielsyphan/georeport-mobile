import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { ReportService } from '../report/report.service';

@Component({
  selector: 'app-my-report-data',
  templateUrl: './my-report-data.page.html',
  styleUrls: ['./my-report-data.page.scss'],
})
export class MyReportDataPage implements OnInit {
  public reportId: any;
  public reportData: any;

  constructor(
      private router: Router,
      public reportService: ReportService,
      public navParams: NavParams,
      public modalController: ModalController
  ) {
    this.reportId = navParams.get('id');
  }

  ngOnInit() {
    this.reportService.reports.forEach((report) => {
      if (report.id === this.reportId) {
        this.reportData = report;
      }
    });

    // tslint:disable-next-line:radix
    switch (parseInt(this.reportData.type)) {
      case 1:
        this.reportData.type = 'Estabelecimento Irregular';
        break;
      case 2:
        this.reportData.type = 'Descarte Irregular de Lixo';
        break;
      case 3:
        this.reportData.type = 'Buraco na via';
        break;
      case 4:
        this.reportData.type = 'Lampada queimada';
        break;
      case 5:
        this.reportData.type = 'Calçada irregular';
        break;
      default:
        this.reportData.type = 'undefined';
        break;
    }
  }

  closePage() {
    this.modalController.dismiss();
  }
}
