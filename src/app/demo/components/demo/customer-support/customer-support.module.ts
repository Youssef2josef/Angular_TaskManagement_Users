import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSupportRoutingModule } from './customer-support-routing.module';
import { CustomerSupportComponent } from './customer-support.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextareaModule } from 'primeng/inputtextarea';



@NgModule({
  declarations: [
    CustomerSupportComponent
  ],
  imports: [
    CommonModule,
    CustomerSupportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextareaModule,
  ]
})
export class CustomerSupportModule { }
