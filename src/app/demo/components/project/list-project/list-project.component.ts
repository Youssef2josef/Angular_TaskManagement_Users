import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TeamManagerService } from 'src/app/demo/service/manager/team-manager.service';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/demo/api/Team';
import { ProjectManagerService } from 'src/app/demo/service/manager/project-manager.service';
import { Observable, forkJoin } from 'rxjs';
import { Project } from 'src/app/demo/api/Project';
import { InfoEmployeeService } from 'src/app/demo/service/employee/info-employee.service';
import { ProjectEmployeeService } from 'src/app/demo/service/employee/project-employee.service';
import { TokenStorageService } from 'src/app/demo/service/token-storage.service';

@Component({
    selector: 'app-list-project',
    templateUrl: './list-project.component.html',
    styleUrls: ['./list-project.component.scss'],
    providers: [MessageService]
})

export class ListProjectComponent implements OnInit {

    projectDialog: boolean = false;

    inactivateProjectDialog: boolean = false;

    inactivateProjectsDialog: boolean = false;

    editProjectsDialog: boolean = false;

    selectedProjects: any;

    submitted: boolean = false;

    submittedEdit: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    teams: Team[] = [];

    allTeams: Team[] = [];

    recentTeams: Team[] = [];

    filteredTeams: Team[] = [];

    filteredProjects: Project[] = [];

    allProjects: Project[] = [];

    dialogHeight: string = '450px';

    manager: any;

    infoUser!: FormGroup;

    managerEmail: any;

    findedProject: any;

    addProject !: FormGroup

    editProjectForm !: FormGroup

    insertProjectForm !: FormGroup

    inactiveProjectInfo: any;

    insertProjectDialog: any;

    permission: boolean = false;

    finishTimeProjectDialog: boolean = false;

    roleManager!: string | null ;

    roleEmployee!: string | null;

    employeeEmail!: string | null;

    employee: any;

    projectTimeFinish:any;

    authToken: string | null = null;

    constructor(private messageService: MessageService, private formBuilder: FormBuilder,
        private teamManagerService: TeamManagerService, private infoManager: InfoManagerService,
        private projectService: ProjectManagerService, private infoEmployee: InfoEmployeeService,
        private projectEmployeeService: ProjectEmployeeService, private tokenStorageService:TokenStorageService) { }

    ngOnInit() {
        this.authToken = this.tokenStorageService.getToken();
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

        this.initCols();
        this.addProject = this.formBuilder.group({
            name: ['', Validators.required],
            startTime: ['', Validators.required],
            finishTime: ['', Validators.required],
        });
        this.insertProjectForm = this.formBuilder.group({
            name: ['', Validators.required],
            teamName: ['', Validators.required],
            token: [localStorage.getItem("auth-token")]
        })
    }

    initCols() {
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'status', header: 'Status' },
            { field: 'creationTime', header: 'Creation Date' },
            { field: 'finishTime', header: 'Finish Date' },
            { field: 'startTime', header: 'startTime' },
            { field: 'estimateFinishTime', header: 'estimateFinishTime' },
        ];

        this.statuses = [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
        ];
    }

    findEmployee(infoUser: any) {
        this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
            this.employee = data;
            //console.log(this.employee);
            this.findAllProjectsClient();
        })
    }

    findManager(infoUser: any) {
        this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
            this.manager = data;
            //console.log(this.manager);
            this.findAllProjects();
            this.findAllTeamsByManager(this.manager.id);
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

    findAllProjects(){
        this.projectService.getAllProjects().subscribe((projects)=>{
            this.allProjects = projects;
            //console.log("projets",this.allProjects)
        });
    }

    findAllProjectsClient(){
        this.projectEmployeeService.findAllProjects().subscribe((projects)=>{
            this.allProjects = projects;
            //console.log("projets",this.allProjects)
        });
    }

    findProjectById(id:any){
        this.projectService.findProjectById(id).subscribe((project)=>{
            this.findedProject= project;
            //console.log("finded project",this.findedProject)
        });
    }

    filterProjects(event: any) {
        const query = event.query.toLowerCase();
        this.filteredProjects = this.allProjects.filter(project =>
            project.name.toLowerCase().includes(query)
        );
        //console.log(this.filteredProjects);
    }

    onProjectChange(event: any) {
        const selectedProject = event.value;
        //console.log('Project selected:', selectedProject);
    }

    filterTeams(event: any) {
        const query = event.query.toLowerCase();
        this.filteredTeams = this.teams.filter(team =>
            team.name.toLowerCase().includes(query) && team.status
        );
        console.log(this.filteredTeams);
    }

    onTeamChange(value: any) {
        //console.log("Selected team:", value);
        const selectedTeam = value;
        //console.log(selectedTeam);
    }

    insertProjectToTeam(){
        this.insertProjectDialog = true;
    }

    openNew() {
        this.submitted = false;
        this.projectDialog = true;
    }

    inactivateProject(project:any){
        this.inactivateProjectDialog = true;
        this.inactiveProjectInfo = project;
    }

    inactivateSelectedProjects(){
        this.inactivateProjectsDialog = true;
    }

    hideDialog() {
        this.projectDialog = false;
        this.submitted = false;
    }

    hideEditDialog(){
        this.editProjectsDialog = false;
        this.submittedEdit = false;
    }

    editProject(project: any) {
        this.findProjectById(project.id);
        this.editProjectsDialog = true;
        this.submittedEdit = false;
    }

    finishTimeProject(project:any){
        this.finishTimeProjectDialog = true;
        this.projectTimeFinish = project;
    }

    onStatusChange(newValue: boolean) {
        //console.log("New status value:", newValue);
    }

    updateProject(){
        //console.log(this.findedProject);
        this.projectService.updateProject(this.findedProject,this.authToken).subscribe(
            (updatedProject) => {
                const index = this.allProjects.findIndex((t: { id: any; }) => t.id === updatedProject.id);
                if (index !== -1) {
                    this.allProjects[index] = updatedProject;
                }
                this.editProjectsDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project updated', life: 3000 });
            },
            (error) => {
                this.editProjectsDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update project', life: 3000 });
            }
        );
    }

    saveProject() {
        //console.log(this.addProject.value);
        this.projectService.addProject(this.addProject.value,this.authToken).subscribe((res:any)=>{
            //console.log(res);
                this.addProject.reset();
                this.projectDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Added', life: 3000 });
                this.allProjects.push(res);
        },
        (error) => {
            //console.log(error);
            this.projectDialog = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add project'+error.error, life: 3000 });
        })
    }

    saveInsertion(){
        //console.log(this.insertProjectForm.value);
        if (this.insertProjectForm.value.teamName.length === 1) {
            //console.log("okay");
            
            // Si un seul team est sélectionné
            this.insertProjectToSingleTeam(this.insertProjectForm.value.teamName[0]);
        } else if (this.insertProjectForm.value.teamName.length > 1) {
            //console.log("Not okay");
            // Si plusieurs teams sont sélectionnés
            this.insertProjectToMultipleTeams(this.insertProjectForm.value.teamName);
        }
    }

    insertProjectToSingleTeam(team: any) {
        const insertionData = {
            projectName: this.insertProjectForm.value.name.name,
            teamName: team.name,
            token: localStorage.getItem("auth-token") || "",
        };
    
        this.teamManagerService.insertProjectToTeam(insertionData).subscribe(
            () => {
                this.insertProjectDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project inserted to team successfully', life: 3000 });
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to insert project to team', life: 3000 });
            }
        );
    }

    insertProjectToMultipleTeams(teams: any[]) {
        const insertionRequests = teams.map(team => {
            const insertionData = {
                projectName: this.insertProjectForm.value.name.name,
                teamName: team.name,
                token: localStorage.getItem("auth-token") || "",
            };
            return this.teamManagerService.insertProjectToTeam(insertionData);
        });
        forkJoin(insertionRequests).subscribe(
            () => {
                this.insertProjectDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project inserted to all teams successfully', life: 3000 });
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to insert project to all teams', life: 3000 });
            }
        );
    }

    updateProjectStatus(project:any) : Observable<any>{
        return this.projectService.inactivateProject(project.name,false,this.authToken);
    }

    confirmFinish(){
        this.projectService.finishProjectTime(this.projectTimeFinish.id,this.authToken).subscribe((updatedProject) =>{
            const index = this.allProjects.findIndex((t: { id: any; }) => t.id === updatedProject.id);
            if (index !== -1) {
                this.allProjects[index] = updatedProject;
            }
            this.finishTimeProjectDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Status project has been updated', life: 3000 });
        },
        (error) => {
            this.finishTimeProjectDialog = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update project', life: 3000 });
        })
    }

    confirmInactiveProjectAction(){
        //console.log(this.inactiveProjectInfo);
        this.projectService.inactivateProject(this.inactiveProjectInfo.name,false,null).subscribe((updatedProject) => {
            const index = this.allProjects.findIndex((t: { id: any; }) => t.id === updatedProject.id);
            if (index !== -1) {
                this.allProjects[index] = updatedProject;
            }
            this.inactivateProjectDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Status project has been updated', life: 3000 });
        },
        (error) => {
            this.inactivateProjectDialog = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update project', life: 3000 });
        })
    }

    confirmInactiveProjectsAction(){

        let inactivateRequests = [];

        for (const project of this.selectedProjects) {
            inactivateRequests.push(this.updateProjectStatus(project));
        }

        forkJoin(inactivateRequests).subscribe(
            (responses) => {
                //console.log(responses);
                for (let response of responses) {
                    const index = this.allProjects.findIndex((t: { id: any; }) => t.id === response.id);
                    if (index !== -1) {
                        this.allProjects[index] = response;
                    }
                }
                this.inactivateProjectsDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Projects have been inactivated', life: 3000 });
            },
            (error) => {
                this.inactivateProjectsDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to inactivate', life: 3000 });
            }
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        const globalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        if (globalFilterValue === 'active') {
            table.filter(true, 'global', 'equals');
        } else if (globalFilterValue === 'inactive') {
            table.filter(false, 'global', 'equals');
        } else if (globalFilterValue && globalFilterValue.includes('creationdate')) {
            const filterDate = new Date(globalFilterValue);
            if (!isNaN(filterDate.getTime())) {
                table.filter(filterDate, 'creationTime', 'equals');
            }
        } else {
            table.filter(globalFilterValue, 'global', 'contains');
        }
    }

    adjustDialogHeight(event: any) {
        const scrollTop = event.target.scrollTop;
        const dialogMaxHeight = 600;
        this.dialogHeight = (scrollTop > dialogMaxHeight ? dialogMaxHeight : scrollTop) + 'px';
    }
}
