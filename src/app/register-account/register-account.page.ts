import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ReportService} from '../report/report.service';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.page.html',
  styleUrls: ['./register-account.page.scss'],
})
export class RegisterAccountPage implements OnInit {

  constructor(
      private modalController: ModalController,
      private reportService: ReportService
  ) { }

  ngOnInit() {
  }

  closePage() {
    this.modalController.dismiss();
  }

  createAccount() {
    this.reportService.alertBox('Alerta!', 'Ainda não é possível registrar uma conta.');
  }
}
