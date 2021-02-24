import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeighbodhoorReportListPage } from './neighbodhoor-report-list.page';

const routes: Routes = [
  {
    path: '',
    component: NeighbodhoorReportListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NeighbodhoorReportListPageRoutingModule {}
