import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordRecoveryService } from 'src/app/demo/service/manager/password-recovery.service';
import { PasswordRecoveryEmployeeService } from 'src/app/demo/service/password-recovery-employee.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RecoveryPasswordComponent implements OnInit {

  email!: string;
  newPassword!: string;
  confirmationPassword!: string;

  recoveryForm!: FormGroup;

  constructor(public layoutService: LayoutService, private formBuilder: FormBuilder, private router: Router,
    private managerService: PasswordRecoveryService, private employeeService: PasswordRecoveryEmployeeService
  ) { }

  ngOnInit(): void {
    this.recoveryForm = this.formBuilder.group({
      email: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmationPassword: [''],
    })
  }

  submit() {
    this.recoveryForm.value.email = this.email;
    this.recoveryForm.value.newPassword = this.newPassword;
    this.recoveryForm.value.confirmationPassword = this.confirmationPassword;

    console.log('Email:', this.email);
    console.log('New Password:', this.newPassword);
    console.log('Confirmation Password:', this.confirmationPassword);
    console.log(this.recoveryForm.value);
    if(sessionStorage.getItem("manager") == "true"){
      this.managerService.changerForgottonPassword(this.recoveryForm.value).subscribe((data)=>{
        console.log(data);
        
        if(data.status == 200){
          sessionStorage.clear();
          Swal.fire({
            title: 'Successul recovery step',
            text: "Your crediantials have been changed. Check your inbox",
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3500
          });
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.navigate([""])
        }
        },(error: HttpErrorResponse)=>{
          sessionStorage.clear();
          Swal.fire({
            title: 'Failed recovery step',
            text: "Either your passwords are not the same or your password is incorrect",
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3500
          });
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.navigate(["/recovery-password"])
        })
    }else if(sessionStorage.getItem("employee") == "true"){
      this.employeeService.changerForgottonPassword(this.recoveryForm.value).subscribe((data)=>{
        console.log(data);

        if(data.status == 200){
          sessionStorage.clear();
          Swal.fire({
            title: 'Successul recovery step',
            text: "Your crediantials have been changed. Check your inbox",
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3500
          });
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.navigate([""])
        }
        },(error: HttpErrorResponse)=>{
          Swal.fire({
            title: 'Failed recovery step',
            text: "Either your passwords are not the same or your password is incorrect",
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3500
          });
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.navigate(["/recovery-password"])
        })
    }
  }

}
