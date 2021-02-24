import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAccountPageRoutingModule } from './register-account-routing.module';

import { RegisterAccountPage } from './register-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterAccountPageRoutingModule
  ],
  declarations: [RegisterAccountPage]
})
export class RegisterAccountPageModule {}
