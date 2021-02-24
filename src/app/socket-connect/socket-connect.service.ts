import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {ReportService} from '../report/report.service';

@Injectable({
  providedIn: 'root'
})
export class SocketConnectService {

  constructor(
      public socket: Socket,
      private reportService: ReportService,
  ) {}

  async socketConnect() {
    await this.socket.disconnect();
    await this.socket.connect();
    this.socket.emit('login', this.reportService.user[0].name);
    console.log('socket-connect');
  }
}
