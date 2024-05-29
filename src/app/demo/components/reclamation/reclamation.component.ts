import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../service/token-storage.service';
import { InfoManagerService } from '../../service/manager/info-manager.service';
import { InfoEmployeeService } from '../../service/employee/info-employee.service';
import { ReclamationService } from '../../service/employee/reclamation.service';
import { ReclamationManagerService } from '../../service/manager/reclamation-manager.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css'],
  providers: [MessageService]
})
export class ReclamationComponent implements OnInit {

  cols: any[] = [];

  roleManager!: string | null ;

  roleEmployee!: string | null;

  employeeEmail!: string | null;

  managerEmail!: string | null;

  authToken: string | null = null;

  permission: boolean = false;

  infoUser!: FormGroup;

  addReclamation!: FormGroup;

  employee: any;

  manager: any;

  reclamationDialog: boolean =false;

  reclamations: any;
  constructor(private tokenStorageService:TokenStorageService, private infoManager: InfoManagerService,
    private formBuilder: FormBuilder, private infoEmployee: InfoEmployeeService, private messageService: MessageService,
    private reclamationServiceEmp: ReclamationService, private reclamationServiceManager: ReclamationManagerService
  ) { }

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

    this.initCols();
    this.addReclamation = this.formBuilder.group({
        nom: ['', Validators.required],
        description: ['', Validators.required],
        managerEmail: ['', Validators.required],
    });
  }

initCols() {
  this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'creationTime', header: 'Creation Time' },
      { field: 'emailManager', header: 'Email Manager' },
  ];
}

findEmployee(infoUser: any) {
  this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
      this.employee = data;
      //console.log(this.employee);
      this.findAllReclamationByEmployee(this.employee);
  })
}

findManager(infoUser: any) {
  this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
      this.manager = data;
      //console.log(this.manager);
      this.findAllReclamationByManager(this.manager)
  })
}

openNew(){
  this.reclamationDialog = true;
}

findAllReclamationByEmployee(employee:any){
  this.reclamationServiceEmp.getReclamationsByEmployee(employee.email).subscribe(
    (data)=>{
      console.log(data);
      this.reclamations = data;
    },(error)=>{
      console.log(error);
    }
  )
}

findAllReclamationByManager(manager:any){
  this.reclamationServiceManager.getReclamationsByManager(manager.email).subscribe(
    (data:any)=>{
      console.log(data);
      this.reclamations = data;
    },(error)=>{
      console.log(error);
    }
  )
}

saveReclamation(){
  const req={
    nom: this.addReclamation.value.nom,
    description: this.addReclamation.value.description,
    employeeEmail: this.employeeEmail,
    managerEmail: this.addReclamation.value.managerEmail
  }
  this.reclamationServiceEmp.addReclamation(req).subscribe(
    (data)=>{
      console.log(data);
      this.reclamationDialog = false;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reclamation sent', life: 3000 });
      this.reclamations.push(data);
    },(error)=>{
      this.reclamationDialog = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add reclamation'+error, life: 3000 });
      console.log(error);
    }
  )
}

onGlobalFilter(table: Table, event: Event) {
  const globalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    table.filter(globalFilterValue, 'global', 'contains');
}

}
