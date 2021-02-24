import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebchatPageRoutingModule } from './webchat-routing.module';

import { WebchatPage } from './webchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebchatPageRoutingModule
  ],
  declarations: [WebchatPage]
})
export class WebchatPageModule {}
