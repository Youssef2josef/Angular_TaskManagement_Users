import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeReportComponent } from './employee-report/employee-report.component';
import { ManagerReportComponent } from './manager-report/manager-report.component';

const routes: Routes = [
  {path:'',component:EmployeeReportComponent},
  {path:'manager',component:ManagerReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
