import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Team } from 'src/app/demo/api/Team';
import { InfoEmployeeService } from 'src/app/demo/service/employee/info-employee.service';
import { TeamEmployeeService } from 'src/app/demo/service/employee/team-employee.service';

@Component({
  selector: 'app-employee-team',
  templateUrl: './employee-team.component.html',
  styleUrls: ['./employee-team.component.css'],
  providers: [MessageService]
})
export class EmployeeTeamComponent implements OnInit {

  insertionSuccess: boolean = true;

  selectedTeams: Team[] = [];

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  employee: any;

  employeeEmail: any;

  roleManager: any;

  roleEmployee: any;

  permission: boolean = false;

  infoUser!: FormGroup;

  selectedTeam: any;

  team: any;

  teamsEmployee: any;

  constructor(private formBuilder: FormBuilder, private infoEmployee: InfoEmployeeService,
    private teamEmployeeService: TeamEmployeeService) { }

  ngOnInit() {
    this.roleManager = localStorage.getItem("manager");
    this.roleEmployee = localStorage.getItem("employee");

    if (this.roleManager == 'true' && !this.roleEmployee) {
      this.permission = true;
    } else if (!this.roleManager && this.roleEmployee == 'true') {
      this.permission = false;
      this.employeeEmail = localStorage.getItem("email");
      this.infoUser = this.formBuilder.group({
        email: [this.employeeEmail],
      })
      this.findEmployee(this.infoUser.value)
    }
    this.initCols();
  }

  initCols() {
    this.cols = [
      { field: 'teamResponseModel.name', header: 'Name' },
      { field: 'teamResponseModel.aim', header: 'Aim' },
      { field: 'teamResponseModel.status', header: 'Status' },
      { field: 'teamResponseModel.creationDate', header: 'Creation Date' },
      { field: 'teamResponseModel.finishDate', header: 'Finish Date' },
      { field: 'disponibilite', header: 'Disponibilité' }, // Modifié pour utiliser la disponibilité calculée
      { field: 'teamResponseModel.projectModel.name', header: 'Project' },
    ];

    this.statuses = [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
    ];
  }

  findEmployee(infoUser: any) {
    this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
      this.employee = data;
      this.findAllTeamsByEmployee(this.employee.id);
    })
  }

  findAllTeamsByEmployee(id: any) {
    this.teamEmployeeService.findAllTeamsByEmployee(id).subscribe((data) => {
      this.teamsEmployee = data.associationTeams.map((team: any) => {
        return {
          ...team,
          disponibilite: team.teamResponseModel.finishDate ? 'Terminé' : 'En cours'
        };
      });
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    const globalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (globalFilterValue === 'active') {
      table.filter(true, 'global', 'equals');
    } else if (globalFilterValue === 'inactive') {
      table.filter(false, 'global', 'equals');
    } else if (globalFilterValue === 'en cours') {
      table.filter('En cours', 'disponibilite', 'contains');
    } else if (globalFilterValue === 'terminé') {
      table.filter('Terminé', 'disponibilite', 'contains');
    } else {
      table.filter(globalFilterValue, 'global', 'contains');
    }
  }

}
