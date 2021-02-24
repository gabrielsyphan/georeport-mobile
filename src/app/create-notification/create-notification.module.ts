import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNotificationPageRoutingModule } from './create-notification-routing.module';

import { CreateNotificationPage } from './create-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNotificationPageRoutingModule
  ],
  declarations: [CreateNotificationPage]
})
export class CreateNotificationPageModule {}
