import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyReportDataPageRoutingModule } from './my-report-data-routing.module';

import { MyReportDataPage } from './my-report-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyReportDataPageRoutingModule
  ],
  declarations: [MyReportDataPage]
})
export class MyReportDataPageModule {}
