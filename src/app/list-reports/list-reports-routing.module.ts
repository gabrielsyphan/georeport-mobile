import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListReportsPage } from './list-reports.page';

const routes: Routes = [
  {
    path: '',
    component: ListReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListReportsPageRoutingModule {}
