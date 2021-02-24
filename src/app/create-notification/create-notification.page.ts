import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ReportService} from '../report/report.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.page.html',
  styleUrls: ['./create-notification.page.scss'],
})
export class CreateNotificationPage implements OnInit {
  private nId: any;
  private reportImage: any;
  private formData: any = {};

  constructor(
      public navParams: NavParams,
      public modalController: ModalController,
      private camera: Camera,
      private reportService: ReportService,
      public http: HttpClient,
  ) {
    this.nId = navParams.get('id');
  }

  ngOnInit() {
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

  async confirmSubmit(){
    const alert = await this.reportService.alertController.create({
      header: 'Alerta!',
      message: 'Deseja mesmo cadastrar esse chamado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar'
        },
        {
          text: 'Confirmar',
          role: 'Confirmar',
          handler: async () => {
            await this.reportService.presentLoading();
            this.submitForm();
          }
        }
      ]
    });
    await alert.present();
  }

  async submitForm() {
    if (this.reportImage === null || this.reportImage === undefined || this.reportImage === '') {
      await this.reportService.loading.dismiss();
      this.reportService.alertBox ('Erro!', 'Por favor, insira uma foto da denúncia');
    }else{
      this.formData.image = this.reportImage;
      if (this.formData.title === undefined || this.formData.description === undefined ||
          this.formData.title === '' || this.formData.description === '') {
        await this.reportService.loading.dismiss();
        this.reportService.alertBox('Erro!', 'Por favor, preencha todos os campos.');
      } else {
        const link = 'https://www.syphan.com.br/georeport/api/createNotification.php';
        const myData = {
          id: this.nId,
          user_name: this.reportService.user[0].name,
          user_registration: this.reportService.user[0].registration,
          title: this.formData.title,
          description: this.formData.description,
          image: this.reportImage,
        };
        this.http.post(link, myData, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
          .subscribe(async dataFromService => {
            await this.reportService.loading.dismiss();
            console.log(dataFromService);
            if (dataFromService == 1) {
              this.reportService.alertBox('Sucesso!', 'O chamado foi cadastrado.');
              (document.getElementById('title') as HTMLInputElement).value = '';
              (document.getElementById('description') as HTMLInputElement).value = '';
              this.reportImage = '';
              this.formData = {};
            } else {
              this.reportService.alertBox('Erro!', 'Não foi possível cadastrar o chamado. ' +
                  'Tente novamente mais tarde ou entre em contato com um moderador.');
            }
            // tslint:disable-next-line:no-unused-expression
          }), async err => {
          await this.reportService.loading.dismiss();
          this.reportService.alertBox('Erro!', 'Não foi possivel cadastrar os dados.');
        };
      }
    }
  }
}
