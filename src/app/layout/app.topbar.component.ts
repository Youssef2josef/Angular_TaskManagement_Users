import { InfoEmployeeService } from './../demo/service/employee/info-employee.service';
import { TokenStorageService } from './../demo/service/token-storage.service';
import { InfoManagerService } from './../demo/service/manager/info-manager.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthManagerService } from '../demo/service/manager/auth-manager.service';
import { Router } from '@angular/router';
import { AuthEmployeeService } from '../demo/service/employee/auth-employee.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [MessageService]
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('picker') picker!: MatDatepicker<Date>;

    manager: any;

    employee: any;

    managerEmail: any;

    employeeEmail: any;

    roleManager: any;

    roleEmployee: any;

    infoUser!: FormGroup;

    token: any;

    placeholderDate: string = 'Choose today';

    link!: string;

    constructor(public layoutService: LayoutService, private infoManagerService: InfoManagerService,
        private formBuilder: FormBuilder, private authManagerService: AuthManagerService,
        private router: Router, private tokenStorageService: TokenStorageService,
        private messageService: MessageService, private infoEmployeeService: InfoEmployeeService,
        private authEmployeeService: AuthEmployeeService) { }

    ngOnInit() {
        this.Today();

        this.roleManager = localStorage.getItem("manager");
        this.roleEmployee = localStorage.getItem("employee");

        if (this.roleManager == 'true' && !this.roleEmployee) {
            //console.log("manager");
            this.managerEmail = localStorage.getItem("email");
            this.infoUser = this.formBuilder.group({
                email: [this.managerEmail],
            })
            this.findManager(this.infoUser.value);
            this.link = "/dashboard/team/list";
        } else if (!this.roleManager && this.roleEmployee == 'true') {
            //console.log("employee");
            this.employeeEmail = localStorage.getItem("email");
            this.infoUser = this.formBuilder.group({
                email: [this.employeeEmail],
            })
            this.findEmployee(this.infoUser.value)
            this.link = "/dashboard/team/employee-team";
        }
    }

    openDatePicker() {
        this.picker.open();
    }

    Today(){
        const today = new Date();
        this.placeholderDate = this.formatDate(today);
        this.picker?.select(today);
    }

    formatDate(date: Date): string {
            const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    findManager(infoUser: any) {
        this.infoManagerService.getInfoAdmin(infoUser).subscribe((data) => {
            this.manager = data;
            //console.log(this.manager);
        })
    }

    findEmployee(infoUser: any) {
        this.infoEmployeeService.getInfoAdmin(infoUser).subscribe((data) => {
            this.employee = data;
            //console.log(this.manager);
        })
    }

    logout() {
        this.token = this.tokenStorageService.getToken();
        if (this.roleManager == 'true' && !this.roleEmployee) {
            this.authManagerService.logout(this.token).subscribe(() => {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate([""]);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Logout Successful', life: 3000 });
            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Internal Server Erreur. We will look after it', life: 3000 });
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate([""]);
            });
        } else if (!this.roleManager && this.roleEmployee == 'true') {
            this.authEmployeeService.logout(this.token).subscribe(() => {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate([""]);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Logout Successful', life: 3000 });

            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Internal Server Erreur. We will look after it', life: 3000 });
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate([""]);
            });
        }
    }
}
