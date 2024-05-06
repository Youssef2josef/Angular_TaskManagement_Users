import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

import { RegisterRoutingModule } from './register-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/app/demo/service/interceptor.service';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { SecretInfoComponent } from './secret-info/secret-info.component';
import { OtherInfoComponent } from './other-info/other-info.component';
import { LastStepComponent } from './last-step/last-step.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";

@NgModule({
  declarations: [
    RegisterComponent,
    PersonalInfoComponent,
    SecretInfoComponent,
    OtherInfoComponent,
    LastStepComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
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
          path: '', component: RegisterComponent, children: [
              { path: '', redirectTo: 'personal', pathMatch: 'full' },
              { path: 'personal', component: PersonalInfoComponent },
              { path: 'secret-info', component: SecretInfoComponent },
              { path: 'other-info', component: OtherInfoComponent },
              { path: 'confirmation', component: LastStepComponent }
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
export class RegisterModule { }
