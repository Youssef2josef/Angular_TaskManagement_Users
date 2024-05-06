import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { ManagerEmployeeService } from 'src/app/demo/service/manager/manager-employee.service';
import { TaskManagerService } from 'src/app/demo/service/manager/task-manager.service';
import { TaskEmployeeService } from 'src/app/demo/service/employee/task-employee.service';
import { InfoEmployeeService } from 'src/app/demo/service/employee/info-employee.service';
import { Employee } from 'src/app/demo/api/Employee';
import { Table } from 'primeng/table';
import { Task } from 'src/app/demo/api/Task';
import { TokenStorageService } from 'src/app/demo/service/token-storage.service';
import { Project } from 'src/app/demo/api/Project';
import { ProjectManagerService } from 'src/app/demo/service/manager/project-manager.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-list-task',
    templateUrl: './list-task.component.html',
    styleUrls: ['./list-task.component.css'],
    providers: [MessageService]
})
export class ListTaskComponent implements OnInit {

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    insertionSuccess: boolean = true;

    insertEmployeeForm !: FormGroup

    addTaskRequest !: FormGroup

    addTeamFormV !: FormGroup

    taskDialog: boolean = false;

    inactivateTasksDialog: boolean = false;

    addUserTaskDialog: boolean = false;

    finishTimeTaskDialog: boolean = false;

    inactiveTasksDialog: boolean = false;

    inactivateTaskDialog: boolean = false;

    addProjectTaskDialog: boolean = false;

    editTaskDialog: boolean = false;

    selectedTasks: any;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20, 50, 100];

    tasks: Task[] = [];

    manager: any;

    employee: any;

    managerEmail: any;

    employeeEmail: any;

    roleManager: any;

    roleEmployee: any;

    permission: boolean = false;

    infoUser!: FormGroup;

    addProjectTask!: FormGroup;

    selectedTask: Task | null = null;

    selectedInactiveTask: Task | null = null;

    editingTask: Task | null = null;

    task: Task | null = null;

    employees: Employee[] = [];

    filteredTasks: Task[] = [];

    filteredProjects: Project[] = [];

    projects: Project[] = [];

    dialogHeight: string = '450px';

    findedEmployee: any;

    taskTimeFinish: any;

    confirmInactiveTeam: boolean = false;

    cities: SelectItem[] = [];

    authToken: string | null = null;

    constructor(private messageService: MessageService, private formBuilder: FormBuilder,
        private taskManagerService: TaskManagerService, private infoManager: InfoManagerService,
        private employeeService: ManagerEmployeeService, private infoEmployee: InfoEmployeeService,
        private taskEmployeeService: TaskEmployeeService, private tokenStorageService: TokenStorageService,
        private projectService: ProjectManagerService) { }

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
            this.insertEmployeeForm = this.formBuilder.group({
                managerEmail: [this.managerEmail],
                employeeEmail: [''],
                taskName: [''],
                coefficient: [''],
            });
            this.findAllProjects();
            this.addProjectTask = this.formBuilder.group({
                taskName: [''],
                projectName: [''],
                token: [this.authToken],
            });
        } else if (!this.roleManager && this.roleEmployee == 'true') {
            this.permission = false;
            //console.log("employee");
            this.employeeEmail = localStorage.getItem("email");
            this.infoUser = this.formBuilder.group({
                email: [this.employeeEmail],
            })
            this.findEmployee(this.infoUser.value)
            this.insertEmployeeForm = this.formBuilder.group({
                managerEmail: [''],
                employeeEmail: [this.employeeEmail],
                taskName: [''],
                coefficient: [''],
            });
            this.addProjectTask = this.formBuilder.group({
                taskName: [''],
                projectName: [''],
                token: [this.authToken],
            });
        }
        this.addTaskRequest = this.formBuilder.group({
            taskName: ['', Validators.required],
        });
        this.initCols();
    }

    initCols() {
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'status', header: 'Status' },
            { field: 'issueDate', header: 'Creation Date' },
            { field: 'finish', header: 'Disponibilite' },
            { field: 'userCreation.firstName', header: 'Manager' },
            { field: 'userCreation.lastName', header: 'Manager' },
            { field: 'project.name', header: 'Project' },
        ];

        this.cities = [
            { label: '0.25', value: "0.25" },
            { label: '0.5', value: "0.5" },
            { label: '0.75', value: "0.75" },
            { label: '1', value: "1" },

        ];

        this.statuses = [
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
        ];
    }

    findEmployee(infoUser: any) {
        this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
            this.employee = data;
            //console.log(this.employee);
            this.getAllEmployeeTasks();
        })
    }

    findManager(infoUser: any) {
        this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
            this.manager = data;
            //console.log(this.manager);
            this.getAllManagerTasks();
        })
    }

    findEmployeeByEmail(email: string): any {
        this.employeeService.getEmployeeByEmail(email).subscribe((data: any) => {
            this.findedEmployee = data;
            //console.log(this.findedEmployee);
        });
    }

    findAllProjects(){
        this.projectService.getAllProjects().subscribe((projects)=>{
            this.projects = projects;
            //console.log("projets",this.allProjects)
        });
    }

    getAllEmployees() {
        this.employeeService.getAllEmployees().subscribe((data: Employee[]) => {
            this.employees = data;
        });
    }

    getAllEmployeeTasks() {
        this.taskEmployeeService.getAllTasks().subscribe((data) => {
            this.tasks = data;
            console.log(data);
        })
    }

    getAllManagerTasks() {
        this.taskManagerService.getAllTasks().subscribe((data) => {
            this.tasks = data;
            console.log(data);
        })
    }

    inactiveSelectedTasks() {
        this.inactiveTasksDialog = true;
    }

    addUserToTask(){
        this.addUserTaskDialog = true;
    }

    newTask() {
        this.taskDialog = true
    }

    saveTask(){
        const managerEmail = this.manager.email;
        const taskName = this.addTaskRequest.value.taskName;

        const task = {
            managerEmail: managerEmail,
            taskName: taskName,
        };

        this.taskManagerService.createTaskWithoutProjectOrUser(task).subscribe(
            (response) => {
                console.log(response);
                this.addTaskRequest.reset();
                this.taskDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task created', life: 3000 });
                this.tasks.push(response);
            },
            (error) => {
                console.log(error);
                this.taskDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create task: '+error, life: 3000 });
            }
        );
    }

    editTask(task:any){
        this.editTaskDialog = true
        this.editingTask = task;
    }

    updateTask(){
        console.log(this.editingTask);
        const formData = {
            id: this.editingTask?.id,
            name: this.editingTask?.name,
            projectName: this.editingTask?.project?.name,
            status: this.editingTask?.status,
            token: this.authToken
        }
        this.taskManagerService.editTask(formData).subscribe(
            (response) =>{
                const index = this.tasks.findIndex(t => t.id === response.id);
                if (index !== -1) {
                    this.tasks[index] = response;
                }
                this.editTaskDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task infos have been changed', life: 3000 });
            },
            (error) => {
                console.log(error);
                this.editTaskDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to modify task: ' + error, life: 3000 });
            }
        )
    }

    inactiveTask(task:any){
        this.inactivateTaskDialog = true;
        this.selectedInactiveTask = task;
    }

    saveTransaction(){
        const token = localStorage.getItem("auth-token")??"";
        //console.log(this.insertEmployeeForm.value);
        //console.log(token);
        if(this.roleEmployee == "true" && !this.roleManager){
            const formData = {
                managerEmail: this.insertEmployeeForm.value.managerEmail,
                employeeEmail: this.insertEmployeeForm.value.employeeEmail,
                taskName: this.insertEmployeeForm.value.taskName.name,
                coefficient: this.insertEmployeeForm.value.coefficient,
                token: ""
            }
            console.log(formData);
            this.taskEmployeeService.insertUserToTask(formData,token).subscribe(
                (response) =>{
                    const index = this.tasks.findIndex(t => t.id === response.id);
                    if (index !== -1) {
                        this.tasks[index] = response;
                    }
                    this.addUserTaskDialog = false;
                    console.log(response);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'You have chosen task successfully', life: 3000 });
                    this.insertEmployeeForm.reset();
                },
                (error) => {
                    console.log(error);
                    this.addUserTaskDialog = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to choose task: ' + error, life: 3000 });
                }
            )
        }else if(this.roleManager == "true" && !this.roleEmployee){
            const formData = {
                managerEmail: this.insertEmployeeForm.value.managerEmail,
                employeeEmail: this.insertEmployeeForm.value.employeeEmail,
                taskName: this.insertEmployeeForm.value.taskName.name,
                coefficient: this.insertEmployeeForm.value.coefficient,
                token: token
            }
            console.log(formData);
            this.taskManagerService.insertUserToTask(formData,token).subscribe(
            (response) =>{
                const index = this.tasks.findIndex(t => t.id === response.id);
                if (index !== -1) {
                    this.tasks[index] = response;
                }
                this.addUserTaskDialog = false;
                console.log(response);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'You have chosen task successfully', life: 3000 });
                this.insertEmployeeForm.reset();
            },
            (error) => {
                console.log(error);
                this.addUserTaskDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to choose task: ' + error, life: 3000 });
            }
            )
        }
    }

    finishTimeTask(task:any){
        this.finishTimeTaskDialog = true;
        this.taskTimeFinish = task;
    }

    confirmFinish(){
        const token = localStorage.getItem("auth-token") ?? " ";
        const id = this.taskTimeFinish.id;
        this.taskManagerService.finishTask(id,token).subscribe(
            (response) =>{
                const index = this.tasks.findIndex(t => t.id === response.id);
                if (index !== -1) {
                    this.tasks[index] = response;
                }
                this.finishTimeTaskDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task is marked as finished', life: 3000 });
            },
            (error) => {
                console.log(error);
                this.finishTimeTaskDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to finish task: ' + error, life: 3000 });
            }
        )
    }

    confirmInactiveTaskAction(){
        console.log(this.selectedInactiveTask);
        const formData ={
            name: this.selectedInactiveTask?.name,
            status: false,
            token: this.authToken
        }
        console.log(formData);
        this.taskManagerService.updateTaskStatus(formData).subscribe(
            (response) =>{
                const index = this.tasks.findIndex(t => t.id === response.id);
                if (index !== -1) {
                    this.tasks[index] = response;
                }
                this.inactivateTaskDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task status is marked as inactive', life: 3000 });
            },
            (error) => {
                console.log(error);
                this.inactivateTaskDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to inactivate task: ' + error, life: 3000 });
            }
        )
    }

    updateTaskStatus(task:any) : Observable<any>{
        const formData ={
            name: task.name,
            status: false,
            token: this.authToken
        }
        return this.taskManagerService.updateTaskStatus(formData);
    }

    confirmInactiveTasksAction(){
        let inactivateRequests = [];

        for (const task of this.selectedTasks) {
            inactivateRequests.push(this.updateTaskStatus(task));
        }

        forkJoin(inactivateRequests).subscribe(
            (responses) => {
                //console.log(responses);
                for (let response of responses) {
                    const index = this.tasks.findIndex((t: { id: any; }) => t.id === response.id);
                    if (index !== -1) {
                        this.tasks[index] = response;
                    }
                }
                this.inactiveTasksDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tasks have been inactivated', life: 3000 });
            },
            (error) => {
                this.inactiveTasksDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to inactivate', life: 3000 });
            }
        );
    }

    addProjectToTask(){
        this.addProjectTaskDialog = true;
    }

    submitProjectTask(){
        this.addProjectTask.value.taskName = this.addProjectTask.value.taskName.name;
        this.addProjectTask.value.projectName = this.addProjectTask.value.projectName.name;
        console.log(this.addProjectTask.value);
        console.log("true");

        this.taskManagerService.insertProjectToTask(this.addProjectTask.value).subscribe(
            (response) =>{
                const index = this.tasks.findIndex(t => t.id === response.id);
                if (index !== -1) {
                    this.tasks[index] = response;
                }
                this.addProjectTaskDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project has been added successfully', life: 3000 });
            },
            (error) => {
                console.log(error);
                this.addProjectTaskDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add project to task: ' + error, life: 3000 });
            }
        )
    }

    onGlobalFilter(table: Table, event: Event) {
        const globalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filter(globalFilterValue, 'global', 'contains');
    }

    adjustDialogHeight(event: any) {
        const scrollTop = event.target.scrollTop;
        const dialogMaxHeight = 600;
        this.dialogHeight = (scrollTop > dialogMaxHeight ? dialogMaxHeight : scrollTop) + 'px';
    }

    filterTasks(event: any) {
        const query = event.query.toLowerCase();
        this.filteredTasks = this.tasks.filter(taskI =>
            taskI.name.toLowerCase().includes(query)
        );
    }

    onTaskChange(event: any) {
        const selectedTask = event.value;
        console.log('Task selected:', selectedTask);
    }

    filterProjects(event: any) {
        const query = event.query.toLowerCase();
        this.filteredProjects = this.projects.filter(project =>
            project.name.toLowerCase().includes(query)
        );
    }

    onProjectChange(event: any) {
        const selectedTask = event.value;
        console.log('Task selected:', selectedTask);
    }

    onStatusChange(newValue: boolean) {
        //console.log("New status value:", newValue);
    }
}
