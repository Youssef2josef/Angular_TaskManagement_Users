import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTeamComponent } from './list-team.component';

const routes: Routes = [
  { path: '', component: ListTeamComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListTeamRoutingModule { }
