import { Component, OnInit } from '@angular/core';
import {ReportService} from '../report/report.service';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-webchat',
  templateUrl: './webchat.page.html',
  styleUrls: ['./webchat.page.scss'],
})
export class WebchatPage implements OnInit {
  private userMessage: any;
  private messages: any = [];
  private userStatus: any = [];

  constructor(
      public reportService: ReportService,
      private socket: Socket,
      public toastController: ToastController
  ) {
    this.listMessage().subscribe((data: any) => {
      let boxClass;
      let userName = data.user.split(' ');
      if (userName[1]) {
        userName = userName[0] + ' ' + userName[1];
      } else {
        userName = userName[0];
      }

      if (data.user === this.reportService.user[0].name) {
        boxClass = 'myMessage';
      } else {
        boxClass = 'outherMessage';
      }
      this.messages.push({user: userName, date: data.date, msg: data.msg, msgClass: boxClass});
    });

    this.listUsers().subscribe(data => {
      console.log(data);
      this.userStatus.push(data);
      this.presentToast(data);
    });
  }

  ngOnInit() {
  }

  listMessage() {
    const observable = new Observable(observer => {
      this.socket.on('chat msg', data => {
        observer.next(data);
      });
    });

    return observable;
  }

  listUsers() {
    const observable = new Observable(observer => {
      this.socket.on('new user', data => {
        observer.next(data);
      });
    });

    return observable;
  }

  sendMessage() {
    if (this.userMessage && this.userMessage.length >= 0) {
      this.socket.emit('chat msg', {date: new Date(), msg: this.userMessage});
      (document.getElementById('userMessage') as HTMLInputElement).value = '';
    } else {
      console.log('Campo vazio');
    }
  }

  async presentToast(userName) {
    const toast = await this.toastController.create({
      message: userName,
      duration: 1500,
      position: 'top',
    });
    toast.present();
  }
}
