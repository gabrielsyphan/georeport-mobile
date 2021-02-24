import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report/report.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import {ModalController} from '@ionic/angular';
import { NeighbodhoorReportListPage } from '../neighbodhoor-report-list/neighbodhoor-report-list.page';

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.page.html',
  styleUrls: ['./list-reports.page.scss'],
})
export class ListReportsPage implements OnInit {
  public nReports: NeighborhoodReports[] = [];
  public aux: any = 1;

  constructor(
      public reportService: ReportService,
      public http: HttpClient,
      public router: Router,
      public modalController: ModalController
  ) { }

  async ngOnInit(event?) {
    const link = 'https://www.syphan.com.br/georeport/api/listNeighborhoods.php';
    await this.http.get(link, {headers: new HttpHeaders({'Content-Type': 'application/json'})}).subscribe(returnData => {
      // @ts-ignore
      Object.values(returnData.neighborhoods).forEach((report => {
        // @ts-ignore
        const countId = report.id;
        this.nReports.push({
          // @ts-ignore
          id: countId,
          // @ts-ignore
          name: report.name,
          // @ts-ignore
          count: returnData.count[countId]
        });
      }));
      this.aux = 2;
    });

    if (event) {
      event.target.complete();
    }
  }

  searchReport(e) {
    const val = (e.target.value).toLowerCase();
    const items = Array.from(document.querySelectorAll('.itens'));
    // tslint:disable-next-line:triple-equals
    if (val && val.trim() != '') {
      items.forEach(item => {
        const label = item.querySelector('strong');
        const shouldShow = label.textContent.toLowerCase().indexOf(val) > -1;
        // @ts-ignore
        item.style.display = shouldShow ? 'block' : 'none';
      });
    }else{
      items.forEach(item => {
        // @ts-ignore
        item.style.display = 'block';
      });
    }
  }

  async openNeighborhoodReports(id, name){
    this.modalController.create({
      component: NeighbodhoorReportListPage,
      componentProps: {
        'id': id,
        'name': name
      }
    }).then((modalElement) => {
      modalElement.present();
    });
  }

  doRefresh(event) {
    this.nReports = [];
    this.aux = 1;
    this.ngOnInit(event);
  }
}

class NeighborhoodReports {
  id: any;
  name: any;
  count: any;
}

