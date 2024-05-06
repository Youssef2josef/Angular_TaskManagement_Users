import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingAcountRoutingModule } from './setting-acount-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { SettingAccountComponent } from './setting-account.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [SettingAccountComponent],
  imports: [
    CommonModule,
    SettingAcountRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ButtonModule,
    MatIconModule
  ]
})
export class SettingAcountModule { }
