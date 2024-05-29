import { Component, OnInit } from '@angular/core';
import { TrackingService } from 'src/app/demo/service/tracking.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenStorageService } from 'src/app/demo/service/token-storage.service';
import { InfoEmployeeService } from 'src/app/demo/service/employee/info-employee.service';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  cols: any[] = [];

  roleManager!: string | null ;

  roleEmployee!: string | null;

  employeeEmail!: string | null;

  managerEmail!: string | null;

  authToken: string | null = null;

  permission: boolean = false;

  infoUser!: FormGroup;

  employee: any;

  manager: any;

  reclamationDialog: boolean =false;

  calendarOptions: any;

  constructor(private trackingService: TrackingService, private formBuilder:FormBuilder,
    private tokenStorageService: TokenStorageService, private infoEmployee: InfoEmployeeService,
    private infoManager: InfoManagerService
  ) {}

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
    } else if (!this.roleManager && this.roleEmployee == 'true') {
        this.permission = true;
        //console.log("employee");
        this.employeeEmail = localStorage.getItem("email");
        this.infoUser = this.formBuilder.group({
            email: [this.employeeEmail],
        })
        this.findEmployee(this.infoUser.value)
    }
    this.initializeCalendarOptions();
  }

  findEmployee(infoUser: any) {
    this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
        this.employee = data;
        //console.log(this.employee);
        this.getTrackingEmployee();
    })
  }
  
  findManager(infoUser: any) {
    this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
        this.manager = data;
        //console.log(this.manager);
        this.getTrackingManager();
    })
  }

  getTrackingEmployee(){
    this.trackingService.getTrackingsEmployee(this.employee.id).subscribe((data) => {
      const events = data.map(item => ({
        title: item.actionName,
        start: item.actionTime,
        extendedProps: {
          user: item.user.name
        }
      }));

      this.calendarOptions = {
        ...this.calendarOptions,
        events: events
    };
    });
  }

  getTrackingManager(){
    this.trackingService.getTrackingsManager(this.manager.id).subscribe((data) => {
      const events = data.map(item => ({
        title: item.actionName,
        start: item.actionTime,
        extendedProps: {
          user: item.user.name
        }
      }));

      this.calendarOptions = {
        ...this.calendarOptions,
        events: events
    };
    });
  }

  initializeCalendarOptions() {
    this.calendarOptions = {
        initialView: 'timeGridWeek',
        slotDuration: '00:15:00',  // Intervalles de 30 minutes
        slotMinTime: '08:00:00',   // Début de la journée à 8h
        slotMaxTime: '20:00:00',   // Fin de la journée à 20h
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek'
        },
        eventOverlap: false // Empêche le chevauchement des événements

    };
  }

  showWorkWeek(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      validRange: {
        start: this.getStartOfWeek(new Date(), 1),
        end: this.getEndOfWeek(new Date(), 5)
      }
    };
  }

  resetView(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      validRange: null
    };
  }

  private getStartOfWeek(date: Date, firstDayOfWeek: number): Date {
    const diff = date.getDay() - firstDayOfWeek;
    return new Date(date.setDate(date.getDate() - diff));
  }

  private getEndOfWeek(date: Date, lastDayOfWeek: number): Date {
    const diff = lastDayOfWeek - date.getDay();
    return new Date(date.setDate(date.getDate() + diff));
  }
}