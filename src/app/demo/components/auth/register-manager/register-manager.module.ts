import { PersonalInfoComponent } from './../register-manager/personal-info/personal-info.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RegisterManagerRoutingModule } from './register-manager-routing.module';
import { LastStepComponent } from '../register-manager/last-step/last-step.component';
import { SecretInfoComponent } from '../register-manager/secret-info/secret-info.component';
import { OtherInfoComponent } from '../register-manager/other-info/other-info.component';
import { RegisterManagerComponent } from './register-manager.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { TabMenuModule } from 'primeng/tabmenu';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { InterceptorService } from 'src/app/demo/service/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    RegisterManagerComponent,
    LastStepComponent,
    SecretInfoComponent,
    PersonalInfoComponent,
    OtherInfoComponent
  ],
  imports: [
    CommonModule,
    RegisterManagerRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatStepperModule,
    MatChipsModule,
    MatSelectModule,
    MatListModule,
    TabMenuModule,
    StepsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    ContextMenuModule,
    DropdownModule,
    MessageModule,
    MessagesModule,
    MatButtonModule,
    NgxMatIntlTelInputComponent,
    RouterModule.forChild([
      {
          path: '', component: RegisterManagerComponent, children: [
              { path: '', redirectTo: 'manager-personal', pathMatch: 'full' },
              { path: 'manager-personal', component: PersonalInfoComponent },
              { path: 'manager-secret-info', component: SecretInfoComponent },
              { path: 'manager-other-info', component: OtherInfoComponent },
              { path: 'manager-confirmation', component: LastStepComponent }
          ]
      }
  ])
  ],
  exports: [RouterModule],
  providers : [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: {showError: true}
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }],
  
})
export class RegisterManagerModule { }
