import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNotificationPage } from './create-notification.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNotificationPageRoutingModule {}
