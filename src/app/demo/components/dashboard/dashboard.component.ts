import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MenuItem, SortEvent } from 'primeng/api';
import { Product } from '../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { TeamManagerService } from '../../service/manager/team-manager.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InfoManagerService } from '../../service/manager/info-manager.service';
import { Team } from '../../api/Team';
import { InfoEmployeeService } from '../../service/employee/info-employee.service';
import { TeamEmployeeService } from '../../service/employee/team-employee.service';


@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    @ViewChild('employeeChart', { static: true }) employeeChartRef!: ElementRef;

    items!: MenuItem[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    recentTeams: any;

    manager: any;

    employee: any;

    managerEmail: any;

    employeeEmail: any;

    infoUser!: FormGroup;

    teams: Team[] = [];

    teamsEmployee: any;

    recentTeamsEmployee: any;

    allTeams: Team[] = [];

    popularTeams: Team[] = [];

    sortField: any;

    sortOrder: any;

    roleManager: any;

    roleEmployee: any;

    permission: boolean = false;

    constructor(public layoutService: LayoutService, private teamEmployeeService: TeamEmployeeService,
        private teamManagerService: TeamManagerService, private formBuilder: FormBuilder,
        private infoManager: InfoManagerService, private infoEmployee: InfoEmployeeService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
            this.initChartClient();
        });
    }

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
            this.findAllTeams();
            this.findAllPopularTeams();
        } else if (!this.roleManager && this.roleEmployee == 'true') {
            this.permission = false;
            //console.log("employee");
            this.employeeEmail = localStorage.getItem("email");
            this.infoUser = this.formBuilder.group({
                email: [this.employeeEmail],
            })
            this.findEmployee(this.infoUser.value)
            this.findAllPopularTeamsEmployee();
        }

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    findManager(infoUser: any) {
        this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
            this.manager = data;
            //console.log(this.manager);
            this.findAllTeamsByManager(this.manager.id);
            this.findAllRecentTeamsByManager(this.manager.id);
        })
    }

    findEmployee(infoUser: any) {
        this.infoEmployee.getInfoAdmin(infoUser).subscribe((data) => {
            this.employee = data;
            //console.log(this.employee);
            this.findAllTeamsByEmployee(this.employee.id);
            this.findRecentTeamsByEmployee(this.employee.id);
        })
    }

    findAllTeamsByEmployee(id: any) {
        this.teamEmployeeService.findAllTeamsByEmployee(id).subscribe((data) => {
            this.teamsEmployee = data.associationTeams;
            //console.log(this.teamsEmployee);
        })
    }

    findRecentTeamsByEmployee(id: any) {
        this.teamEmployeeService.findRecentTeamsByEmployee(id).subscribe((data) => {
            this.recentTeamsEmployee = data.associationTeams;
            //console.log(this.recentTeamsEmployee);
        })
    }

    findAllTeamsByManager(id: any) {
        this.teamManagerService.findAllTeamsByHead(id).subscribe((data) => {
            this.teams = data;
            //console.log(this.teams);
        })
    }

    findAllRecentTeamsByManager(id: any) {
        this.teamManagerService.findAllRecentTeamsByHead(id).subscribe((response) => {
            this.recentTeams = response;
            //console.log(this.recentTeams);
        })
    }

    findAllTeams() {
        this.teamManagerService.getAllTeams().subscribe((Response) => {
            this.allTeams = Response;
            //console.log(this.allTeams);
        })
    }

    findAllPopularTeams() {
        this.teamManagerService.getAllPopularTeams().subscribe((Response) => {
            this.popularTeams = Response;
            //console.log(this.popularTeams);
            this.initChart();
        })
    }

    findAllPopularTeamsEmployee() {
        this.teamEmployeeService.getAllPopularTeams().subscribe((Response) => {
            this.popularTeams = Response;
            //console.log(this.popularTeams);
            this.initChartClient();
        })
    }

    initChart() {
        //console.log(teamData);
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Préparer les données pour le graphique
        const employeesByTeam: { [key: string]: number } = {}; // Annoter le type de employeesByTeam

        this.popularTeams.forEach((team: Team) => {
            if (team.teamEmployees) {
                employeesByTeam[team.name] = team.teamEmployees.length;
            } else {
                // Handle the case where employees array is undefined
                employeesByTeam[team.name] = 0; // or any default value you prefer
            }
        });

        //console.log(employeesByTeam);

        // Créer les labels (noms des équipes) et les données (nombre d'employés par équipe)
        const teamNames = Object.keys(employeesByTeam);
        const employeeCounts = Object.values(employeesByTeam);
        this.chartData = {
            labels: teamNames,
            datasets: [
                {
                    label: 'Number of Employees',
                    data: employeeCounts,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'), // Couleur de fond du graphique
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'), // Couleur de la bordure du graphique
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    initChartClient() {
        //console.log(teamData);
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Préparer les données pour le graphique
        const employeesByTeam: { [key: string]: number } = {}; // Annoter le type de employeesByTeam

        this.popularTeams.forEach((team: any) => {
            if (team.employees) {
                employeesByTeam[team.name] = team.employees.length;
            } else {
                // Handle the case where employees array is undefined
                employeesByTeam[team.name] = 0; // or any default value you prefer
            }
        });

        //console.log(employeesByTeam);

        // Créer les labels (noms des équipes) et les données (nombre d'employés par équipe)
        const teamNames = Object.keys(employeesByTeam);
        const employeeCounts = Object.values(employeesByTeam);
        this.chartData = {
            labels: teamNames,
            datasets: [
                {
                    label: 'Number of Employees',
                    data: employeeCounts,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'), // Couleur de fond du graphique
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'), // Couleur de la bordure du graphique
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onSort(event: SortEvent) {
        this.sortField = event.field;
        this.sortOrder = event.order;

        if (this.sortOrder === 1) {
            // Tri croissant
            this.recentTeams.sort((a: any, b: any) => {
                if (a[this.sortField] < b[this.sortField]) return -1;
                if (a[this.sortField] > b[this.sortField]) return 1;
                return 0;
            });
        } else {
            // Tri décroissant
            this.recentTeams.sort((a: any, b: any) => {
                if (a[this.sortField] < b[this.sortField]) return 1;
                if (a[this.sortField] > b[this.sortField]) return -1;
                return 0;
            });
        }
    }
}
