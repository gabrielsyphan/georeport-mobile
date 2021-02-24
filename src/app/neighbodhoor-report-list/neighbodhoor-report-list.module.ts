import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NeighbodhoorReportListPageRoutingModule } from './neighbodhoor-report-list-routing.module';

import { NeighbodhoorReportListPage } from './neighbodhoor-report-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NeighbodhoorReportListPageRoutingModule
  ],
  declarations: [NeighbodhoorReportListPage]
})
export class NeighbodhoorReportListPageModule {}
