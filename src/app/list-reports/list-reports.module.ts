import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListReportsPageRoutingModule } from './list-reports-routing.module';

import { ListReportsPage } from './list-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListReportsPageRoutingModule
  ],
  declarations: [ListReportsPage]
})
export class ListReportsPageModule {}
