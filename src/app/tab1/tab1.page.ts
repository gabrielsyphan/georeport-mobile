import {Component, OnInit} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { SocketConnectService } from '../socket-connect/socket-connect.service';
import { ReportService } from '../report/report.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import 'leaflet.markercluster';
import 'leaflet-routing-machine/dist/leaflet-routing-machine';
import {Observable} from 'rxjs';

const LeafIcon = L.Icon.extend({
  options: {
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
      public geolocation: Geolocation,
      public http: HttpClient,
      public storage: Storage,
      public diagnostic: Diagnostic,
      public reportService: ReportService,
      public socketConnect: SocketConnectService,
  ) {
    this.socketConnect.socketConnect();

    this.listGolocation().subscribe(data => {
      this.loadCurrentMarkers(data);
    });
  }

  @ViewChild(ReportService) content: ReportService;

  map: L.map = null;
  mapTiles: any = {};
  ctrTiles: any = {};
  ctrLayers: any = {};
  myRoute: any = {};
  latitude: any;
  longitude: any;
  markers: Marker[] = [];
  localeAux = 0;
  currentPosition = 0;
  currentTeam = 0;
  auxTestGps = 0;

  async ngOnInit(){
    await this.reportService.presentLoading();
    await this.reportService.loadSaved();
    //this.checkGps();
    this.leafletMap();
  }

  listGolocation() {
    const observable = new Observable(observer => {
      this.socketConnect.socket.on('geolocation', data => {
        observer.next(data);
      });
    });

    return observable;
  }

  async sendCurrentPosition(location) {
    this.socketConnect.socket.emit('geolocation', {latitude: location.latitude, longitude: location.longitude});
  }

  checkGps(){
    const successCallback = async (isAvailable) => {
      // tslint:disable-next-line:triple-equals
      if (isAvailable == false){
        await this.reportService.loading.dismiss();
        this.alertGps();
      }else{
        this.leafletMap();
      }
    };

    this.diagnostic.isGpsLocationEnabled().then(successCallback);
  }

  testGps() {
    const successCallback = async (isAvailable) => {
      // tslint:disable-next-line:triple-equals
      if (isAvailable == false){
        if(this.auxTestGps === 0) {
          await this.reportService.loading.dismiss();
          this.alertGps2();
        }
      }
    };

    setTimeout(() => {
      this.testGps();
    }, 1000);

    this.diagnostic.isGpsLocationEnabled().then(successCallback);
  }

  async leafletMap() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.mapTiles['Mapa Jawg'] = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=C1vu4LOmp14JjyXqidSlK8rjeSlLK1W59o1GAfoHVOpuc6YB8FSNyOyHdoz7QIk6', {
          maxNativeZoom: 19,
          maxZoom: 19,
          minZoom: 10
      });

      this.map = L.map('mapId', {
          center: [this.latitude, this.longitude],
          layers: this.mapTiles['Mapa Jawg'],
          zoomControl: true,
          maxZoom: 19,
          minZoom: 10,
          zoom: 18
      });

      this.markers.push({
        user: this.reportService.user[0].name,
        obj: L.marker([this.latitude, this.longitude], { icon: defaultIcon }).bindPopup('Você está aqui!').addTo(this.map),
      });

      //this.testGps();
      this.loadCurrentPosition();
      this.loadMarkers();

      this.map.invalidatesize();
    });
  }

  async loadCurrentPosition(){
    await this.geolocation.getCurrentPosition().then(async (resp) => {
      if (this.latitude !== resp.coords.latitude || this.longitude !== resp.coords.longitude) {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;

        const auxMarker = Object.values(this.markers);
        auxMarker.forEach((marker) => {
          if (marker !== undefined && marker.user === this.reportService.user[0].name){
            this.map.removeLayer(marker.obj);
          }
        });

        this.markers.push({
          user: this.reportService.user[0].name,
          obj: L.marker([this.latitude, this.longitude], { icon: defaultIcon }).bindPopup('Você está aqui!').addTo(this.map),
        });

        if (this.currentTeam === 1) {
          await this.sendCurrentPosition(resp.coords);
        }
      }
    });
    setTimeout(() => {
      this.loadCurrentPosition();
    }, 100);
  }

  async loadMarkers(){
    const groupMarker = new L.MarkerClusterGroup({
      disableClusteringAtZoom: 14,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true
    });

    const link = 'https://www.syphan.com.br/georeport/api/listReports.php';
    const myData = {latitude: this.latitude, longitude: this.longitude, request: 1};
    this.http.post<any[]>(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
    .subscribe(dataFromService => {
      dataFromService.forEach((element) => {
        if (element.image) {
          L.marker([element.latitude, element.longitude], { icon: reportIcon }).bindPopup('<div style="font-weight: bold; ' +
              'text-align: center; color: #df514f;">' + element.title + '</div><hr style="background: #e4e4e4;"><div><span ' +
              'style="font-weight: strong;">Distância:</span> ' + element.distance + '</div><div><span style="font-weight: strong;">' +
              'Descrição:</span> ' + element.description + '</div><br><div style="text-align: center"><img style="border-radius: 5px;" src="' + element.image + '">')
              .addTo(groupMarker);
        }else {
          // tslint:disable-next-line:max-line-length
          L.marker([element.latitude, element.longitude], { icon: reportIcon }).bindPopup('<div style="font-weight: bold; ' +
              'text-align: center; color: #df514f;">' + element.title + '</div><hr style="background: #e4e4e4;"><div><span ' +
              'style="font-weight: strong;">Distância:</span> ' + element.distance + '</div><div><span style="font-weight: strong;">' +
              'Descrição:</span> ' + element.description + '</div><hr style="background: #e4e4e4;">').addTo(groupMarker);
        }
      });
    });
    this.map.addLayer(groupMarker);
    const aux = this;
    const tester = [];
    let checkRoute = 0;
    // tslint:disable-next-line:only-arrow-functions
    groupMarker.on('click', function(e) {
      tester.forEach((point) => {
        const content = e.latlng.lat + ', ' + e.latlng.lng;
        // tslint:disable-next-line:triple-equals
        if (content == point){
          checkRoute = 1;
          console.log('The route has already been defined');
        }
      });

      if (checkRoute === 0) {
        L.Routing.control({
          waypoints: [
            L.latLng(e.latlng.lat, e.latlng.lng),
            L.latLng(aux.latitude, aux.longitude)
          ],
          showAlternatives: false,
          lineOptions: {styles: [{color: '#242c81', weight: 4}]},
          show: false,
          createMarker(){
            return null;
          },
          routeWhileDragging: true,
        }).addTo(aux.map);
        tester.push(e.latlng.lat + ', ' + e.latlng.lng);
      }
    });
    this.reportService.loading.dismiss();
  }

  async currentLocale(){
    this.map.setView(new L.LatLng(this.latitude, this.longitude), 18);
  }

  async loadCurrentTeam() {
    if (this.currentTeam === 0) {
      this.socketConnect.socket.emit('geolocation', {latitude: this.latitude, longitude: this.longitude});
      this.currentTeam = 1;
    } else {
      this.currentTeam = 0;
    }
  }

  async confirmLoadCurrentTeam() {
    let messageText = '';
    if (this.currentTeam === 0){
      messageText = 'Deseja mesmo ativar o carregamento do grupo em tempo real?';
    }else{
      messageText = 'Deseja mesmo cancelar o carregamento do grupo em tempo real?';
    }
    const alert = await this.reportService.alertController.create({
      header: 'Alerta!',
      message: '' + messageText,
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar',
        },
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: async () => {
            this.loadCurrentTeam();
          }
        }
      ]
    });
    await alert.present();
  }

  async alertGps() {
      const alert = await this.reportService.alertController.create({
      header: 'Alerta!',
      message: 'Por favor, ative o seu GPS.',
      buttons: [
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: async () => {
            await this.reportService.presentLoading();
            this.checkGps();
          }
        }
      ]
    });
      await alert.present();
  }

  async alertGps2() {
    this.auxTestGps = 1;
    const alert = await this.reportService.alertController.create({
      header: 'Alerta!',
      message: 'Por favor, ative o seu GPS.',
      buttons: [
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: async () => {
            this.auxTestGps = 0;
          }
        }
      ]
    });
    await alert.present();
  }

  async loadCurrentMarkers(data) {
    const auxMarker = Object.values(this.markers);
    let auxArrayMarker = 0;
    auxMarker.forEach((marker) => {
      if (marker !== undefined && marker.user === data.user) {
        this.map.removeLayer(marker.obj);
        marker.obj = L.marker([data.latitude, data.longitude], { icon: defaultIcon }).bindPopup(data.user).addTo(this.map);
        auxArrayMarker = 1;
      }
    });

    if (auxArrayMarker === 0) {
      this.markers.push({
        user: data.user,
        obj: L.marker([data.latitude, data.longitude], { icon: defaultIcon }).bindPopup(data.user).addTo(this.map),
      });
    }
  }

  async doRefresh() {
    await this.socketConnect.socket.disconnect();
    await this.socketConnect.socketConnect();
    await this.map.remove();
    document.getElementById('mapId').innerHTML = '<div id="mapId" style="width: 100%; height: 100%;"></div>';
    this.ngOnInit();
  }
}

class Marker {
  user: any;
  obj: any;
}
