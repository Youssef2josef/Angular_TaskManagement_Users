import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'teams', loadChildren: () => import('./teams.module').then(m => m.TeamsModule) },
    { path: 'chart', loadChildren: () => import('./add-team/add-team.module').then(m => m.AddTeamModule) },
    { path: 'list', loadChildren: () => import('./list-team/list-team.module').then(m => m.ListTeamModule) },
    { path: 'employee-team', loadChildren: () => import('./employee-team/team-employee.module').then(m => m.TeamEmployeeModule) },

])],
exports: [RouterModule]
})
export class TeamsRoutingModule { }
