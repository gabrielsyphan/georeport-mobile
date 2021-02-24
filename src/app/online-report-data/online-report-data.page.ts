import { Component, OnInit } from '@angular/core';
import {ReportService} from '../report/report.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ModalController, NavParams} from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-routing-machine/dist/leaflet-routing-machine';
import { CreateNotificationPage } from '../create-notification/create-notification.page';
import {FullScreenImage} from '@ionic-native/full-screen-image/ngx';

const shadowUrl = '../../assets/leaflet/images/marker-shadow.png';

const LeafIcon = L.Icon.extend({
  options: {
    shadowUrl,
    iconSize: [31, 40],
    shadowSize: [41, 41],
    iconAnchor: [15, 41],
    shadowAnchor: [13, 41],
    popupAnchor: [0, -41]
  }
});

const defaultIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-icon.png' });
const reportIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-4.png' });

@Component({
  selector: 'app-online-report-data',
  templateUrl: './online-report-data.page.html',
  styleUrls: ['./online-report-data.page.scss'],
})
export class OnlineReportDataPage implements OnInit {
  public nId: any;
  public reportData: any = {};
  public reportType: any;
  public notifications: any = [];

  map: L.map = null;
  // tslint:disable-next-line:variable-name
  map_tiles: any = {};
  // tslint:disable-next-line:variable-name
  ctr_tiles: any = {};
  // tslint:disable-next-line:variable-name
  ctr_layers: any = {};
  latitude: any;
  longitude: any;
  marker: any;
  localeAux = 0;
  currentPosition = 0;

  constructor(
      public reportService: ReportService,
      public http: HttpClient,
      public modalController: ModalController,
      public geolocation: Geolocation,
      public navParams: NavParams,
      private fullScreenImage: FullScreenImage
  ) {
    this.nId = navParams.get('id');
    this.geolocation.getCurrentPosition().then((resp) => {
      let link: any = 'https://www.syphan.com.br/georeport/api/reportData.php';
      let myData: any = {id: this.nId, latitude: resp.coords.latitude, longitude: resp.coords.longitude};
      this.http.post<any[]>(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
          .subscribe(dataFromService => {
            console.log(dataFromService);
            this.reportData = dataFromService;

            switch (this.reportData.type) {
              case '1':
                this.reportType = 'Estabelecimento irregular';
                break;
              case '2':
                this.reportType = 'Descarte Irregular de lixo';
                break;
              case '3':
                this.reportType = 'Buraco na via';
                break;
              case '4':
                this.reportType = 'Lâmpada queimada';
                break;
              case '5':
                this.reportType = 'Calçada irregular';
                break;
              default:
                this.reportService.alertBox('Erro!', 'Tipo de denúncia não identificada.');
            }
          });

      link = 'https://www.syphan.com.br/georeport/api/reportNotifications.php';
      myData = {id: this.nId};
      this.http.post<any[]>(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
          .subscribe(dataFromService => {
            this.notifications = dataFromService;
        });
      this.leafletMap();
    });
  }

  async ngOnInit() {

  }

  async leafletMap() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.map_tiles['Mapa Jawg'] = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=C1vu4LOmp14JjyXqidSlK8rjeSlLK1W59o1GAfoHVOpuc6YB8FSNyOyHdoz7QIk6', {
        maxNativeZoom: 19,
        maxZoom: 19,
        minZoom: 10
      });
      this.ctr_tiles['Mapa Jawg'] = this.map_tiles['Mapa Jawg'];

      this.map_tiles['Mapa OSM'] = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxNativeZoom: 19,
        maxZoom: 19,
        minZoom: 10
      });
      this.ctr_tiles['Mapa OSM'] = this.map_tiles['Mapa OSM'];

      this.map = L.map('mapId2', {
        center: [this.latitude, this.longitude],
        layers: [this.map_tiles['Mapa OSM']],
        zoomControl: true,
        maxZoom: 19,
        minZoom: 10,
        zoom: 10
      });

      L.control.layers(this.ctr_tiles, this.ctr_layers).addTo(this.map);

      this.marker = L.marker([this.latitude, this.longitude], { icon: defaultIcon }).addTo(this.map).bindPopup('Você está aqui!')
          .openPopup();

      const latitude = this.reportData.latitude;
      const longitude = this.reportData.longitude;
      if (latitude && longitude) {
        L.Routing.control({
          waypoints: [
            L.latLng(this.latitude, this.longitude),
            L.latLng(this.reportData.latitude, this.reportData.longitude)
          ],
          showAlternatives: false,
          lineOptions: {styles: [{color: '#242c81', weight: 4}]},
          show: false,
          createMarker(){
            return L.marker([latitude, longitude], { icon: reportIcon }).bindPopup('A denúncia está aqui!');
          },
          routeWhileDragging: true,
        }).addTo(this.map);
      }
    });

    this.reportService.loading.dismiss();
  }

  closePage() {
    this.modalController.dismiss();
  }

  createNotification() {
    this.modalController.create({
      component: CreateNotificationPage,
      componentProps: {
        'id': this.nId
      }
    }).then((modalElement) => {
      modalElement.present();
    });
  }

  async doRefresh(event) {
    await this.geolocation.getCurrentPosition().then((resp) => {
      let link: any = 'https://www.syphan.com.br/georeport/api/reportData.php';
      let myData: any = {id: this.nId, latitude: resp.coords.latitude, longitude: resp.coords.longitude};
      this.http.post<any[]> (link, myData, {headers: new HttpHeaders ({'Content-Type': 'application/json'})})
          .subscribe (dataFromService => {
            console.log (dataFromService);
            this.reportData = dataFromService;

            switch ( this.reportData.type ) {
              case '1':
                this.reportType = 'Estabelecimento irregular';
                break;
              case '2':
                this.reportType = 'Descarte Irregular de lixo';
                break;
              case '3':
                this.reportType = 'Buraco na via';
                break;
              case '4':
                this.reportType = 'Lâmpada queimada';
                break;
              case '5':
                this.reportType = 'Calçada irregular';
                break;
              default:
                this.reportService.alertBox ('Erro!', 'Tipo de denúncia não identificada.');
            }
          });

      link = 'https://www.syphan.com.br/georeport/api/reportNotifications.php';
      myData = {id: this.nId};
      this.http.post<any[]> (link, myData, {headers: new HttpHeaders ({'Content-Type': 'application/json'})})
          .subscribe (dataFromService => {
            this.notifications = dataFromService;
            event.target.complete();
          });
    });
  }

  openFullScreenImage(image) {
    this.fullScreenImage.showImageBase64(image)
        .then((data: any) => console.log(data))
        .catch((error: any) => console.error(error));
  }
}
