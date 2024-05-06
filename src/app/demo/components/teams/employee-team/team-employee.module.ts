import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamEmployeeRoutingModule } from './team-employee-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmployeeTeamComponent } from './employee-team.component';

@NgModule({
  declarations: [
    EmployeeTeamComponent
  ],
  imports: [
    CommonModule,
    TeamEmployeeRoutingModule,
    MatFormFieldModule,
    AutoCompleteModule,
    InputNumberModule,
    MatSelectModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    FileUploadModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
  ]
})
export class TeamEmployeeModule { }
