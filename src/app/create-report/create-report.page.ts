import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ReportService } from '../report/report.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.page.html',
  styleUrls: ['./create-report.page.scss'],
})
export class CreateReportPage implements OnInit {

  public reportImage: any;
  public formData: any = {};

  constructor(
      private camera: Camera,
      public reportService: ReportService,
  ) { }

  ngOnInit() {
  }

  async submitForm() {
    if (this.reportImage === null || this.reportImage === undefined || this.reportImage === '') {
      await this.reportService.loading.dismiss();
      this.reportService.alertBox ('Erro!', 'Por favor, insira uma foto da denúncia');
    }else{
      this.formData.image = this.reportImage;
      if (this.formData.type === undefined || this.formData.title === undefined || this.formData.date === undefined
          || this.formData.description === undefined) {
        await this.reportService.loading.dismiss();
        this.reportService.alertBox('Erro!', 'Por favor, preencha todos os campos.');
      } else {
        if (this.formData.process === undefined) {
          this.formData.process = null;
        }
        await this.reportService.newReport (this.formData);
        (document.getElementById('type') as HTMLInputElement).value = '';
        (document.getElementById('title') as HTMLInputElement).value = '';
        (document.getElementById('process') as HTMLInputElement).value = '';
        (document.getElementById('date') as HTMLInputElement).value = '';
        (document.getElementById('description') as HTMLInputElement).value = '';
        this.reportImage = '';
        this.formData = {};
      }
    }
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
      message: 'Deseja mesmo cadastrar essa denúncia?',
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
}
