import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineReportDataPage } from './online-report-data.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineReportDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineReportDataPageRoutingModule {}
