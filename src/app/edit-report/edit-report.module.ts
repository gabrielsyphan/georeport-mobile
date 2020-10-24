import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditReportPageRoutingModule } from './edit-report-routing.module';

import { EditReportPage } from './edit-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditReportPageRoutingModule
  ],
  declarations: [EditReportPage]
})
export class EditReportPageModule {}
