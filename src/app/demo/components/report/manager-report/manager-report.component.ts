import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { InfoEmployeeService } from 'src/app/demo/service/employee/info-employee.service';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';
import { ReportManagerService } from 'src/app/demo/service/manager/report-manager.service';
import { TokenStorageService } from 'src/app/demo/service/token-storage.service';

@Component({
  selector: 'app-manager-report',
  templateUrl: './manager-report.component.html',
  styleUrls: ['./manager-report.component.css'],
  providers: [MessageService]
})
export class ManagerReportComponent implements OnInit {

  manager: any;

  roleManager!: string | null;

  roleEmployee!: string | null;

  managerEmail!: string | null;

  authToken: string | null = null;

  permission: boolean = false;

  infoUser!: FormGroup;

  addReport!: FormGroup;

  cols: any[] = [];

  reports: any;

  reportDialog: boolean = false;

  constructor(private tokenStorageService: TokenStorageService, private infoManager: InfoManagerService,
    private formBuilder: FormBuilder, private infoEmployee: InfoEmployeeService, private messageService: MessageService,
    private reportService: ReportManagerService) { }

  ngOnInit() {
    this.authToken = this.tokenStorageService.getToken();
    this.roleManager = localStorage.getItem("manager");
    this.roleEmployee = localStorage.getItem("employee");
    //console.log(typeof this.roleEmployee);

    if (this.roleManager == 'true' && !this.roleEmployee) {
      this.permission = false;
      //console.log("manager");
      this.managerEmail = localStorage.getItem("email");
      this.infoUser = this.formBuilder.group({
          email: [this.managerEmail],
      })
      this.findManager(this.infoUser.value);
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

  findManager(infoUser: any) {
    this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
        this.manager = data;
        //console.log(this.manager);
        this.findMyReports()
      })
  }

  findMyReports(){
    this.reportService.myReports(this.manager.email).subscribe((data: any) => {
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
        this.reportDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated', life: 3000 });
        this.reports.push(response)
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
