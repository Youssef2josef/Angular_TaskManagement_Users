import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTeamRoutingModule } from './add-team-routing.module';
import { AddTeamComponent } from './add-team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [
    AddTeamComponent
  ],
  imports: [
    CommonModule,
    AddTeamRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule
  ]
})
export class AddTeamModule { }
