import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Project } from 'src/app/demo/api/Project';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';
import { ProjectManagerService } from 'src/app/demo/service/manager/project-manager.service';
import { TeamManagerService } from 'src/app/demo/service/manager/team-manager.service';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    allProjects: Project[] = [];
    manager: any;
    managerEmail: any;
    permission: boolean = false;
    roleManager!: string | null ;
    infoUser!: FormGroup;
    doughnutData: any;
    doughnutOptions: any;
    linearChartData: any;
    linearChartOptions: any;
    pieChartData: any;
    pieChartOptions: any

    constructor(private teamManagerService: TeamManagerService, private infoManager: InfoManagerService,
        private projectService: ProjectManagerService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.roleManager = localStorage.getItem("manager");

        if (this.roleManager == 'true') {
            this.permission = true;
            console.log("manager");
            this.managerEmail = localStorage.getItem("email");
            this.infoUser = this.formBuilder.group({
                email: [this.managerEmail],
            })
            this.findManager(this.infoUser.value);
        }
    }

    findManager(infoUser: any) {
        this.infoManager.getInfoAdmin(infoUser).subscribe((data) => {
            this.manager = data;
            this.findAllProjects();
        })
    }

    findAllProjects(){
        this.projectService.getAllProjects().subscribe((projects)=>{
            this.allProjects = projects.map((project: { finishTime: null; }) => {
                return {
                    ...project,
                    isAvailable: project.finishTime === null,
                    isCompleted: project.finishTime !== null
                };
            });
            console.log("projets", this.allProjects);
            this.initializePieChart();
            this.initializeDoughnutChart();
            this.initializeLinearChart();
            
        });
    }

    initializeDoughnutChart() {
        const availableProjectsCount = this.allProjects.filter(project => project.isAvailable).length;
        const completedProjectsCount = this.allProjects.filter(project => project.isCompleted).length;

        this.doughnutData = {
            labels: ['Available', 'Completed'],
            datasets: [
                {
                    data: [availableProjectsCount, completedProjectsCount],
                    backgroundColor: ['#36A2EB', '#FFCE56'],
                    hoverBackgroundColor: ['#36A2EB', '#FFCE56']
                }
            ]
        };

        this.doughnutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'black',
                    fontSize: 14,
                    padding: 20
                }
            },
            title: {
                display: true,
                text: 'Project Status',
                fontSize: 18,
                fontColor: 'black',
                padding: 20
            }
        };
    }

    initializeLinearChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        const projectsPerMonth = Array.from({ length: 12 }, () => 0);
    
        this.allProjects.forEach(project => {
            const monthIndex = +project.startTime.split('-')[1]; // Extraire le mois en tant que nombre
            //console.log(monthIndex);
            
            projectsPerMonth[monthIndex - 1]++; // Incrémenter le nombre de projets pour le mois correspondant
            //console.log(projectsPerMonth);
        });
    
        this.linearChartData = {
            labels: months,
            datasets: [
                {
                    label: 'Number of Projects',
                    data: projectsPerMonth,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.5
                }
            ]
        };
    
        this.linearChartOptions = {
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

    initializePieChart() {
        let activeProjectsCount = 0;
        let inactiveProjectsCount = 0;
    
        this.allProjects.forEach(project => {
            if (project.status) {
                activeProjectsCount++;
            } else {
                inactiveProjectsCount++;
            }
        });

        this.pieChartData = {
            labels: ['Active', 'Inactive'],
            datasets: [
                {
                    data: [activeProjectsCount, inactiveProjectsCount],
                    backgroundColor: [
                        'rgb(54, 162, 235)', // Couleur pour les projets actifs
                        'rgb(255, 99, 132)'  // Couleur pour les projets inactifs
                    ]
                }
            ]
        };
    
        this.pieChartOptions = {
            responsive: true,
            maintainAspectRatio: false
        };
    }

}
