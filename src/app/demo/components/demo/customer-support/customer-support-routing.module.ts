import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSupportComponent } from './customer-support.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
    { path: '', component: CustomerSupportComponent},
  ])],
  exports: [RouterModule]
})
export class CustomerSupportRoutingModule { }
