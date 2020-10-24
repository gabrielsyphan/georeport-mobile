import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {ReportService} from '../report/report.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading: any;

  constructor(
    private router: Router,
    public http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public reportService: ReportService,
  ) { }

  ngOnInit() {
  }

  async validateLogin(){
    await this.presentLoading();
    const login = (document.getElementById('userLogin') as HTMLInputElement).value;
    const password = (document.getElementById('userPassword') as HTMLInputElement).value;

    const link = 'https://semecmaceio.com/maceio-geo/json/loginapp.php';
    const myData = {registration: login, password, team: 1};
    this.http.post<any[]>(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
        .subscribe(dataFromService => {
            // @ts-ignore
            if (dataFromService.response == 1){
                // @ts-ignore
                this.reportService.loginUser(login, dataFromService.name, 1);
                this.loading.dismiss();
                this.router.navigateByUrl('');
            }else{
                this.loading.dismiss();
                this.alertBox('Alerta!', 'Não existe usuário com essa combinação de login e senha.');
            }
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
}
