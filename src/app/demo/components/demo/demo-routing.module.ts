import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoComponent } from './demo.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
    { path: '', component: DemoComponent},
    { path: 'customer', loadChildren: () => import('./customer-support/customer-support.module').then(m => m.CustomerSupportModule) },
  ])],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
