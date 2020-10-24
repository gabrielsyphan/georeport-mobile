import {Component, OnInit} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as L from 'leaflet';
import { ReportService } from '../report/report.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import 'leaflet.markercluster';
import 'leaflet.animatedmarker/src/AnimatedMarker';

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
const myIcon = L.icon({
  iconUrl: '../../assets/leaflet/images/marker-icon.png'
});

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
      private geolocation: Geolocation,
      public http: HttpClient,
      public storage: Storage,
      public diagnostic: Diagnostic,
      public reportService: ReportService
  ) {}

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

  async ngOnInit(){
    await this.reportService.loadSaved();
    // this.checkGps();
    this.leafletMap();
  }

  checkGps(){
    const successCallback = (isAvailable) => {
      // tslint:disable-next-line:triple-equals
      if (isAvailable == false){
        this.alertGps();
      }else{
        this.leafletMap();
      }
    };

    this.diagnostic.isGpsLocationEnabled().then(successCallback);
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

      this.map = L.map('mapId', {
          center: [this.latitude, this.longitude],
          layers: [this.map_tiles['Mapa OSM']],
          zoomControl: true,
          maxZoom: 19,
          minZoom: 10,
          zoom: 18
      });

      L.control.layers(this.ctr_tiles, this.ctr_layers).addTo(this.map);

      // tslint:disable-next-line:max-line-length
      this.marker = L.marker([this.latitude, this.longitude], { icon: defaultIcon }).addTo(this.map).bindPopup(this.reportService.user[0].name).openPopup();
      this.loadMarkers();
      this.loadCurrentPosition();
    });
  }

  async loadCurrentPosition(){
    await this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      if (this.marker !== undefined) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([this.latitude, this.longitude], { icon: defaultIcon }).addTo(this.map).bindPopup('Você está aqui!');
    });
    setTimeout(() => {
      this.loadCurrentPosition();
    }, 5000);
  }

  async loadMarkers(){
    const groupMarker = new L.MarkerClusterGroup({
      disableClusteringAtZoom: 14,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true
    });

    const link = 'https://semecmaceio.com/maceio-geo/json/listreports.php';
    const myData = {latitude: this.latitude, longitude: this.longitude, request: 1};
    this.http.post<any[]>(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
    .subscribe(dataFromService => {
      dataFromService.forEach((element) => {
        if (element.image) {
          L.marker([element.latitude, element.longitude], { icon: reportIcon }).bindPopup(element.title + ' - ' + element.distance + '<img src="' + element.image + '">').addTo(groupMarker);
        }else {
          // tslint:disable-next-line:max-line-length
          L.marker([element.latitude, element.longitude], { icon: reportIcon }).bindPopup(element.title + ' - ' + element.distance).addTo(groupMarker);
        }
      });
    });
    this.map.addLayer(groupMarker);
  }

  async currentLocale(){
    this.map.setView(new L.LatLng(this.latitude, this.longitude), 18);
  }

  async alertGps(){
      const alert = await this.reportService.alertController.create({
      header: 'Alerta!',
      message: 'Por favor, ative o seu GPS.',
      buttons: [
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: () => {
            this.checkGps();
          }
        }
      ]
    });
      await alert.present();
  }
}
