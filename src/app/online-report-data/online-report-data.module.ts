import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineReportDataPageRoutingModule } from './online-report-data-routing.module';

import { OnlineReportDataPage } from './online-report-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineReportDataPageRoutingModule
  ],
  declarations: [OnlineReportDataPage]
})
export class OnlineReportDataPageModule {}
