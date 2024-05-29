import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { InfoEmployeeService } from 'src/app/demo/service/employee/info-employee.service';
import { ReportEmployeeService } from 'src/app/demo/service/employee/report-employee.service';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';
import { TokenStorageService } from 'src/app/demo/service/token-storage.service';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css'],
  providers: [MessageService]
})
export class EmployeeReportComponent implements OnInit {

  employee: any;

  roleManager!: string | null;

  roleEmployee!: string | null;

  employeeEmail!: string | null;

  authToken: string | null = null;

  permission: boolean = false;

  infoUser!: FormGroup;

  addReport!: FormGroup;

  cols: any[] = [];

  reports: any;

  reportDialog: boolean = false;

  constructor(private tokenStorageService: TokenStorageService, private infoManager: InfoManagerService,
    private formBuilder: FormBuilder, private infoEmployee: InfoEmployeeService, private messageService: MessageService,
    private reportService: ReportEmployeeService) { }

  ngOnInit() {
    this.authToken = this.tokenStorageService.getToken();
    this.roleManager = localStorage.getItem("manager");
    this.roleEmployee = localStorage.getItem("employee");
    //console.log(typeof this.roleEmployee);

    if (!this.roleManager && this.roleEmployee == 'true') {
      //this.permission = true;
      //console.log("employee");
      this.employeeEmail = localStorage.getItem("email");
      this.infoUser = this.formBuilder.group({
        email: [this.employeeEmail],
      })
      this.findEmployee(this.infoUser.value)
    } else {

    }

    this.addReport = this.formBuilder.group({
      timeStart: [""],
      timeEnd: [""],
    })

    this.initCols();
  }
  initCols() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'userEmail', header: 'User Email' },
      { field: 'userFirstName', header: 'User First Name' },
      { field: 'userLastName', header: 'User Last Name' },
      { field: 'creationTime', header: 'Creation Time' },
    ];
  }

  findEmployee(infoUser: any) {
    this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
      this.employee = data;
      //console.log(this.employee);
      this.findMyReports()
    })
  }

  findMyReports(){
    this.reportService.myReports(this.employee.email).subscribe((data: any) => {
      this.reports = data;
      console.log(this.reports);
      
    },(error: HttpErrorResponse)=>{
      console.log(error);
    })
  }

  openNew(){
    this.reportDialog = true
  }

  save(){
    console.log(this.addReport.value);
    const requestBody = {
      emailEmployee: localStorage.getItem("email"),
      timeStart: this.addReport.value.timeStart+":00.000000+00:00", // Gardez toISOString() si nécessaire pour envoyer la date
      timeEnd: this.addReport.value.timeEnd+":00.000000+00:00"// Gardez toISOString() si nécessaire pour envoyer la date
    };
    console.log(requestBody);

    this.reportService.createReport(requestBody).subscribe(
      (response) => {
        // Gérez la réponse si nécessaire
        console.log("Report created successfully:", response);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated', life: 3000 });
        this.reports.push(response)
        this.reportDialog = false;
      },
      (error) => {
        // Gérez les erreurs si nécessaire
        console.error("Error creating report:", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add report'+error, life: 3000 });

      }
    );
  }

  downloadReport(reportId:number,report:any): void {
    this.reportService.downloadRapport(reportId,report);

  }

  onGlobalFilter(table: Table, event: Event) {
    const globalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      table.filter(globalFilterValue, 'global', 'contains');
  }
}
