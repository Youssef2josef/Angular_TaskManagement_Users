import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/demo/api/Team';
import { InfoManagerService } from 'src/app/demo/service/manager/info-manager.service';
import { TeamManagerService } from 'src/app/demo/service/manager/team-manager.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {

  manager: any;
  teams: any;
  recentTeams: any;
  managerEmail: any;
  infoUser!: FormGroup;

  barData: any;
  barOptions: any;

  pieData: any;
  pieOptions: any;

  subscription!: Subscription;

  falseEmployees: number[] = [];
  trueEmployees: number[] = [];

  falseTeamsCount: number = 0;
  trueTeamsCount: number = 0;

  linearChartData: any;
  linearChartOptions: any;

  teamsDonutChartData: any;
  teamsDonutChartOptions: any;

  constructor(private infoManager: InfoManagerService, private teamManagerService: TeamManagerService,
    private formBuilder: FormBuilder, public layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initChart();
    });
  }

  ngOnInit(): void {
    this.initChart();
    this.managerEmail = localStorage.getItem("email");
    this.infoUser = this.formBuilder.group({
      email: [this.managerEmail],
    })
    this.findManager(this.infoUser.value);
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
    this.teamManagerService.findAllTeamsByHead(id).subscribe((data: any) => {
      this.teams = data;
      //console.log(this.teams);
      this.initChart();
      this.initializeLinearChart();
      this.initializeTeamsDonutChart();
    })
  }

  findAllRecentTeamsByManager(id: any) {
    this.teamManagerService.findAllRecentTeamsByHead(id).subscribe((response) => {
      this.recentTeams = response;
      //console.log(this.recentTeams);
      this.initChart();
    })
  }

  countTeamsByStatus() {
    if (!this.teams) return;

    this.trueTeamsCount = this.teams.filter((team: { status: boolean; }) => team.status === true).length;
    this.falseTeamsCount = this.teams.filter((team: { status: boolean; }) => team.status === false).length;
  }


  initChart() {
    //console.log(teamData);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    if (!this.recentTeams) return;

    this.recentTeams.forEach((team: { teamEmployees: { active: boolean; }[]; }) => {
      //console.log(team.teamEmployees);

      let falseCount = 0;
      let trueCount = 0;

      // Check if teamEmployees is defined before looping
      if (team.teamEmployees) {
        team.teamEmployees.forEach((employee: { active: boolean; }) => {
          //console.log(employee);
          if (employee.active === false) {
            falseCount++;
          } else {
            trueCount++;
          }
        });
        //console.log(falseCount);
      }

      this.falseEmployees.push(falseCount);
      this.trueEmployees.push(trueCount);
    });

    if (this.teams) {
      this.teams.forEach((team: { status: boolean; }) => {
        //console.log(team);
        //console.log(team.status);
        if (team.status) {
          this.trueTeamsCount++;
        } else {
          this.falseTeamsCount++;
        }
        //console.log(falseCount);
      });
    }

    //console.log(employeesByTeam);

    const teamNames = this.recentTeams.map((team: { name: any; }) => team.name);

    this.barData = {
      labels: teamNames,
      datasets: [
        {
          label: 'Employees with status "false"',
          data: this.falseEmployees,
          backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
          borderColor: documentStyle.getPropertyValue('--bluegray-700'),
        },
        {
          label: 'Employees with status "true"',
          data: this.trueEmployees,
          backgroundColor: documentStyle.getPropertyValue('--green-600'),
          borderColor: documentStyle.getPropertyValue('--green-600'),
        }
      ],

    };

    this.barOptions = {
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

    //console.log(this.trueTeamsCount, this.falseTeamsCount);

    this.pieData = {
      labels: ['True Teams', 'False Teams'],
      datasets: [
        {
          data: [this.trueTeamsCount, this.falseTeamsCount],
          backgroundColor: [
            documentStyle.getPropertyValue('--green-600'),
            documentStyle.getPropertyValue('--red-600')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--red-400')
          ]
        }]
    };


    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  initializeLinearChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Initialiser un tableau pour stocker le nombre de nouvelles équipes créées chaque mois
    const teamsPerMonth = Array.from({ length: 12 }, () => 0);

    // Parcourir toutes les équipes et compter le nombre de nouvelles équipes créées chaque mois
    this.teams.forEach((team: { creationDate: string | number | Date; }) => {
      const creationMonthIndex = new Date(team.creationDate).getMonth(); // Récupérer l'index du mois de création
      teamsPerMonth[creationMonthIndex]++; // Incrémenter le nombre d'équipes pour le mois correspondant
    });

    // Configuration des données du graphique linéaire
    this.linearChartData = {
      labels: months,
      datasets: [
        {
          label: 'Number of Teams Created',
          data: teamsPerMonth,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.5
        }
      ]
    };

    // Configuration des options du graphique linéaire
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


  initializeTeamsDonutChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const finishedTeams = this.teams.filter((team: { finishDate: null; }) => team.finishDate !== null).length;
    const availableTeams = this.teams.length - finishedTeams;

    this.teamsDonutChartData = {
      labels: ['Completed', 'Available'],
      datasets: [
        {
          data: [finishedTeams, availableTeams],
          backgroundColor: [
            documentStyle.getPropertyValue('--red-600'),
            documentStyle.getPropertyValue('--green-600'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--red-400'),
            documentStyle.getPropertyValue('--green-400'),
          ]
        }
      ]
    };

    this.teamsDonutChartOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };
  }



}
