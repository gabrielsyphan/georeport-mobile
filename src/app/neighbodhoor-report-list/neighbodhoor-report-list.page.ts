import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {ReportService} from '../report/report.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {OnlineReportDataPage} from '../online-report-data/online-report-data.page';

@Component({
  selector: 'app-neighbodhoor-report-list',
  templateUrl: './neighbodhoor-report-list.page.html',
  styleUrls: ['./neighbodhoor-report-list.page.scss'],
})
export class NeighbodhoorReportListPage implements OnInit {
  public nName: any;
  public nId: any;
  public reports: any = [];
  public aux: any = 1;

  constructor(
    public modalController: ModalController,
    public reportService: ReportService,
    public navParams: NavParams,
    public http: HttpClient,
    public geolocation: Geolocation,
  ){
    this.nId = navParams.get('id');
    this.nName = navParams.get('name');
  }

  async ngOnInit(event?) {
    await this.geolocation.getCurrentPosition().then((resp) => {
      const link = 'https://www.syphan.com.br/georeport/api/neighborhoodReportList.php';
      const myData = {id: this.nId, latitude: resp.coords.latitude, longitude: resp.coords.longitude};
      this.http.post<any[]>(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
        .subscribe(dataFromService => {
          this.reports = dataFromService;
          this.aux = 2;
        });
    });

    if (event) {
      event.target.complete();
    }
  }

  closePage() {
    this.modalController.dismiss();
  }

  searchReport(e) {
    const val = (e.target.value).toLowerCase();
    const items = Array.from(document.querySelectorAll('.itens'));
    // tslint:disable-next-line:triple-equals
    if (val && val.trim() != '') {
      items.forEach(item => {
        const label = item.querySelector('h3');
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

  async openReportData(id){
    this.reportService.presentLoading();
    this.modalController.create({
      component: OnlineReportDataPage,
      componentProps: {
        'id': id
      }
    }).then((modalElement) => {
      modalElement.present();
    });
  }

  doRefresh(event) {
    this.reports = [];
    this.aux = 1;
    this.ngOnInit(event);
  }
}
