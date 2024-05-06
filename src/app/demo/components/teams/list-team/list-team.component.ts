import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TeamManagerService } from 'src/app/demo/service/manager/team-manager.service';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Team } from 'src/app/demo/api/Team';
import { HttpErrorResponse } from '@angular/common/http';
import { ManagerEmployeeService } from 'src/app/demo/service/manager/manager-employee.service';
import { Employee } from 'src/app/demo/api/Employee';
import { Observable, forkJoin } from 'rxjs';
import { InfoEmployeeService } from 'src/app/demo/service/employee/info-employee.service';
import { TeamEmployeeService } from 'src/app/demo/service/employee/team-employee.service';
import { delay } from 'rxjs/operators';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-list-team',
    templateUrl: './list-team.component.html',
    styleUrls: ['./list-team.component.css'],
    providers: [MessageService,ConfirmationService]
})
export class ListTeamComponent implements OnInit {

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    insertionSuccess: boolean = true;

    insertEmployeeForm !: FormGroup

    addTeamForm !: FormGroup

    addTeamFormV !: FormGroup

    teamDialog: boolean = false;

    employeeStatusTeamDialog: boolean = false;

    newTeamDialog: boolean = false;

    editTeamDialog: boolean = false;

    finishTimeTeamDialog: boolean = false;

    inactiveTeamDialog: boolean = false;

    inactiveTeamsDialog: boolean = false;

    selectedTeams: Team[] = [];

    submitted: boolean = false;

    submittedAdd: boolean = false;

    submittedEdit: boolean = false;

    submittedFinishTime: boolean = false;

    submittedEmployeeStatus: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    teams: Team[] = [];

    allTeams: Team[] = [];

    recentTeams: Team[] = [];

    manager: any;

    employee: any;

    managerEmail: any;

    employeeEmail: any;

    roleManager: any;

    roleEmployee: any;

    permission: boolean = false;

    infoUser!: FormGroup;

    selectedTeam: Team | null = null;

    team: any;

    employees: Employee[] = [];

    filteredEmployees: Employee[] = [];

    filteredTeams: Team[] = [];

    dialogHeight: string = '450px';

    findedEmployee: any;

    teamName: string = '';

    findedTeam: any;

    editTeamForm !: FormGroup;

    teamTimeFinish: any;

    teamEmployee: any;

    teamsEmployee: any;

    inactiveTeamInfo: { teamName: string, emailEmployee: string, newStatus: boolean, managerEmail: string, token: string } =
        { teamName: '', emailEmployee: '', newStatus: false, managerEmail: '', token: '' };
    inactivateEmployeeInfo: { teamName: string, emailEmployee: string, newStatus: boolean, managerEmail: string, token: string } =
        { teamName: '', emailEmployee: '', newStatus: false, managerEmail: '' , token: ''};

    confirmInactiveTeam: boolean = false;
    employeeStatus: any;

    constructor(private messageService: MessageService, private formBuilder: FormBuilder,
        private teamManagerService: TeamManagerService, private infoManager: InfoManagerService,
        private employeeService: ManagerEmployeeService, private infoEmployee: InfoEmployeeService,
        private teamEmployeeService: TeamEmployeeService) { }

    ngOnInit() {
        this.roleManager = localStorage.getItem("manager");
        this.roleEmployee = localStorage.getItem("employee");
        //console.log(typeof this.roleEmployee);

        if (this.roleManager == 'true' && !this.roleEmployee) {
            this.permission = true;
            //console.log("manager");
            this.managerEmail = localStorage.getItem("email");
            this.infoUser = this.formBuilder.group({
                email: [this.managerEmail],
            })
            this.findManager(this.infoUser.value);
        } else if (!this.roleManager && this.roleEmployee == 'true') {
            this.permission = false;
            //console.log("employee");
            this.employeeEmail = localStorage.getItem("email");
            this.infoUser = this.formBuilder.group({
                email: [this.employeeEmail],
            })
            this.findEmployee(this.infoUser.value)
        }
        this.insertEmployeeForm = this.formBuilder.group({
            employeeEmail: [''],
            teamName: ['']
        });
        this.addTeamFormV = this.formBuilder.group({
            teamName: ['', Validators.required],
            aim: ['', Validators.required],
        });
        this.initCols();
    }

    initCols() {
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'aim', header: 'Aim' },
            { field: 'status', header: 'Status' },
            { field: 'creationDate', header: 'Creation Date' },
            { field: 'finishDate', header: 'Finish Date' },
            { field: 'disponibilite', header: 'Disponibilite' },
            { field: 'projectModel.name', header: 'Project' },
        ];

        this.statuses = [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
        ];
    }

    expandAll() {
        if (!this.isExpanded) {
            this.teams.forEach(team => team && team.name ? this.expandedRows[team.name] = true : '');
            console.log(this.expandedRows);
            
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    findEmployee(infoUser: any) {
        this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
            this.employee = data;
            //console.log(this.employee);
            this.findAllTeamsByEmployee(this.employee.id);
        })
    }

    findAllTeamsByEmployee(id: any) {
        this.teamEmployeeService.findAllTeamsByEmployee(id).subscribe((data) => {
            this.teamsEmployee = data.associationTeams;
            //console.log(this.teamsEmployee);
        })
    }

    findManager(infoUser: any) {
        this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
            this.manager = data;
            //console.log(this.manager);
            this.findAllTeamsByManager(this.manager.id);
            this.findAllRecentTeamsByManager(this.manager.id);
        })
    }

    findAllTeamsByManager(id: any) {
        this.teamManagerService.findAllTeamsByHead(id).subscribe((data) => {
            this.teams = data;
            console.log(this.teams);
        })
    }

    findAllRecentTeamsByManager(id: any) {
        this.teamManagerService.findAllRecentTeamsByHead(id).subscribe((response) => {
            this.recentTeams = response;
            //console.log(this.recentTeams);
        })
    }

    findTeamById(id: any) {
        this.teamManagerService.getTeamById(id).subscribe((response) => {
            this.team = response;
            console.log(this.team);
            //console.log(this.editTeamForm.value);
            //console.log(this.team);
        })
    }

    findTeamByName(name: any): any {
        this.teamManagerService.getTeamByName(name).subscribe((response) => {
            this.findedTeam = response;
            //console.log(this.team);
        })
    }

    getAllEmployees() {
        this.employeeService.getAllEmployees().subscribe((data: Employee[]) => {
            this.employees = data;
        });
    }

    findEmployeeByEmail(email: string): any {
        this.employeeService.getEmployeeByEmail(email).subscribe((data: any) => {
            this.findedEmployee = data;
            //console.log(this.findedEmployee);
        });
    }

    updateTeam() {
        const token = localStorage.getItem("auth-token")??"";
        this.teamManagerService.updateTeam(this.team,token).subscribe(
            (updatedTeam) => {
                //console.log(updatedTeam);
                const index = this.teams.findIndex(t => t.id === updatedTeam.id);
                if (index !== -1) {
                    this.teams[index] = updatedTeam;
                }
                this.editTeamDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Updated', life: 3000 });
            },
            (error) => {
                this.editTeamDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Team', life: 3000 });
            }
        );
    }

    confirmFinish() {
        //console.log(this.teamTimeFinish);
        const token = localStorage.getItem("auth-token") ?? '';
        this.teamManagerService.finishTeamTime(this.teamTimeFinish.id,token).subscribe(
            (res) => {
            const index = this.teams.findIndex(t => t.id === res.id);
                if (index !== -1) {
                    this.teams[index] = res;
                }
                this.finishTimeTeamDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Time Finish Time Updated', life: 3000 });
            },
            (error) => {
                this.finishTimeTeamDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Team', life: 3000 });
            }
        );
    }

    saveTeam() {
        const teamName = this.insertEmployeeForm.value.teamName;

        let insertRequests = [];

        if (Array.isArray(this.insertEmployeeForm.value.employeeEmail)) {
            const employeeEmails = this.insertEmployeeForm.value.employeeEmail;

            employeeEmails.forEach((employee: any) => {
                insertRequests.push(this.insertEmployeeToTeam(teamName.id, employee.id));
            });
        } else {
            const employeeEmail = this.insertEmployeeForm.value.employeeEmail;
            insertRequests.push(this.insertEmployeeToTeam(teamName.id, employeeEmail.id));
        }

        forkJoin(insertRequests).subscribe(
            (responses) => {
                console.log(responses);
                
                this.teamDialog = false;
                if(insertRequests.length == 1){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee has been inserted to the team', life: 3000 });
                setTimeout(() => {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please refresh the page to synchronize changes', life: 3000 });
                }, 2000);
                }else if(insertRequests.length != 1){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employees have been inserted to the team', life: 3000 });
                setTimeout(() => {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please refresh the page to synchronize changes', life: 3000 });
                }, 2000);
                }
            },
            (error) => {
                this.teamDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to insert', life: 3000 });
            }
        );
    }

    addTeam() {
        const managerFirstName = this.manager.firstName;
        const managerLastName = this.manager.lastName;
        const managerEmail = this.manager.email;
        const teamName = this.addTeamFormV.value.teamName;
        const aim = this.addTeamFormV.value.aim;
        const token = localStorage.getItem("auth-token") || '';

        const team = {
            headName: managerFirstName,
            headLastName: managerLastName,
            email: managerEmail,
            teamName: teamName,
            aim: aim,
            token: token
        };

        this.teamManagerService.addTeam(team).subscribe(
            (response) => {
                //console.log(response);
                this.addTeamFormV.reset();
                this.newTeamDialog = false;
                this.submittedAdd = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Added', life: 3000 });
                this.teams.push(response);
            },
            (error) => {
                //console.log(error);
                this.newTeamDialog = false;
                this.submittedAdd = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add team:\n'+error, life: 3000 });
            }
        );
    }

    insertEmployeeToTeam(teamId: any, employeeId: any): Observable<any> {
        const token = localStorage.getItem("auth-token") ?? '';
        return this.teamManagerService.insertEmployeeToTeam(teamId,employeeId,token);
    }

    openNew() {
        this.getAllEmployees();
        this.submitted = false;
        this.teamDialog = true;
    }

    newTeam() {
        this.submittedAdd = false;
        this.newTeamDialog = true;
    }

    inactiveSelectedTeams() {
        this.inactiveTeamsDialog = true;
    }

    editTeam(team: Team) {
        this.findTeamById(team.id)
        this.submittedEdit = false;
        this.editTeamDialog = true;
    }

    finishTimeTeam(team: Team) {
        this.teamTimeFinish = team;
        this.finishTimeTeamDialog = true;
        this.submittedFinishTime = false;
    }

    updateEmployeeStatus(team: Team , employee: any){
        this.teamEmployee = team;
        this.employeeStatus = employee;
        this.employeeStatusTeamDialog = true;
        this.submittedEmployeeStatus = false;
    }

    inactiveTeam(team: Team) {
        this.inactiveTeamInfo = { 
            teamName: team.name, emailEmployee: '', newStatus: false, managerEmail: localStorage.getItem("email") || '', token: localStorage.getItem("auth-token")??''};
        this.inactiveTeamDialog = true;
    }

    confirmUpdateEmployee(employeeStatus: any, teamEmployee: any){
        this.inactivateEmployeeInfo = { teamName: teamEmployee.name, emailEmployee: employeeStatus.employee.email, newStatus: false, managerEmail: '', token: localStorage.getItem("auth-token")??''};
        this.teamManagerService.updateEmployeeStatusInTeam(this.inactivateEmployeeInfo).subscribe(
            (response: any) => {
                teamEmployee = response;
                const index = this.teams.findIndex(t => t.id === teamEmployee.id);
                if (index !== -1) {
                    this.teams[index] = teamEmployee;
                }
                this.employeeStatusTeamDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Status Updated', life: 3000 });
            },
            (error) => {
                this.employeeStatusTeamDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update employee status', life: 3000 });
            })
    }

    confirmInactiveSelected() {
        this.inactiveTeamsDialog = false;
        for (const team of this.selectedTeams) {
            const updateEmployeeTeam = {
                teamName: team.name,
                emailEmployee: '',
                newStatus: false,
                emailHead: localStorage.getItem("email") || '',
                token: localStorage.getItem("auth-token") || '',
            };
            this.teamManagerService.updateTeamStatus(updateEmployeeTeam).subscribe(
                (response) => {
                    const teamIndex = this.teams.findIndex(t => t.name === team.name);
                    if (teamIndex !== -1) {
                        this.teams[teamIndex].status = false;
                    }
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to inactivate team: ' + team.name, life: 3000 });
                }
            );
        }
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Selected Teams Inactivated', life: 3000 });
    }

    confirmDelete() {
        this.inactiveTeamDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    hideDialog() {
        this.teamDialog = false;
        this.submitted = false;
    }

    hideEditDialog() {
        this.editTeamDialog = false;
        this.submittedEdit = false;
    }

    hideAddDialog() {
        this.newTeamDialog = false;
        this.submittedAdd = false;
    }

    hideFinishTeamDialog() {
        this.finishTimeTeamDialog = false;
        this.submittedFinishTime = false;
    }

    filterEmployees(event: any) {
        const query = event.query.toLowerCase();
        this.filteredEmployees = this.employees.filter(employee =>
            employee.email.toLowerCase().includes(query)
        );
    }

    filterTeams(event: any) {
        const query = event.query.toLowerCase();
        this.filteredTeams = this.teams.filter(team =>
            team.name.toLowerCase().includes(query)
        );
        //console.log(this.filteredTeams);
    }

    onTeamChange(value: any) {
        //console.log("Selected team:", value);
        this.selectedTeam = value;
        //console.log(this.selectedTeam);
    }

    onEmployeeChange(event: any) {
        const selectedEmployee = event.value;
        //console.log('Employee selected:', selectedEmployee);
    }

    onGlobalFilter(table: Table, event: Event) {
        const globalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        if (globalFilterValue === 'active') {
            table.filter(true, 'global', 'equals');
        } else if (globalFilterValue === 'inactive') {
            table.filter(false, 'global', 'equals');
        } else {
            table.filter(globalFilterValue, 'global', 'contains');
        }
    }

    toggleTeamDetails(team: Team) {
        this.selectedTeam = this.selectedTeam === team ? null : team;
    }

    showTeamDetails(team: Team) {
        this.selectedTeam = this.selectedTeam === team ? null : team;
    }

    confirmInactiveTeamAction() {
        const updateEmployeeTeam = {
            teamName: this.inactiveTeamInfo.teamName,
            emailEmployee: '',
            newStatus: this.inactiveTeamInfo.newStatus,
            emailHead: this.inactiveTeamInfo.managerEmail,
            token: localStorage.getItem("auth-token"),
        };

        this.teamManagerService.updateTeamStatus(updateEmployeeTeam).subscribe(
            (response) => {
                //console.log(response);
                const teamIndex = this.teams.findIndex(team => team.name === this.inactiveTeamInfo.teamName);
                if (teamIndex !== -1) {
                    this.teams[teamIndex].status = this.inactiveTeamInfo.newStatus;
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Inactivated', life: 3000 });
            },
            (error: HttpErrorResponse) => {
                //console.error('Error occurred while updating team status:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to desactivate team', life: 3000 });
            }
        );
        this.inactiveTeamDialog = false;
    }

    adjustDialogHeight(event: any) {
        const scrollTop = event.target.scrollTop;
        const dialogMaxHeight = 600;
        this.dialogHeight = (scrollTop > dialogMaxHeight ? dialogMaxHeight : scrollTop) + 'px';
    }

    onStatusChange(newValue: boolean) {
        //console.log("New status value:", newValue);
    }
}
