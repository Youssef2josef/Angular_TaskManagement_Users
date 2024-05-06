import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SettingAccountService } from '../../service/employee/setting-account.service';
import { SettingAccountManagerService } from '../../service/manager/setting-account-manager.service';


@Component({
  selector: 'app-setting-account',
  templateUrl: './setting-account.component.html',
  styleUrls: ['./setting-account.component.css']
})
export class SettingAccountComponent implements OnInit {

  updatePassword!: FormGroup
  hide_one = true;
  hide_two = true;
  hide_three = true;
  manager!: string | undefined;
  employee!: string | undefined;

  constructor(private formBuilder: FormBuilder, private settingServiceManager: SettingAccountManagerService,
    private settingServiceEmployee: SettingAccountService) { }

  ngOnInit(): void {
    this.updatePassword = this.formBuilder.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      currentPassword: new FormControl('', [Validators.minLength(6), Validators.maxLength(40), Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
      newPassword: new FormControl('', [Validators.minLength(6), Validators.maxLength(40), Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
      confirmationPassword: new FormControl('', [Validators.minLength(6), Validators.maxLength(40), Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
    })
  }

  getErrorEmail() {
    if (this.updatePassword.controls["email"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.updatePassword.controls["email"].hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessageCurrentPassword() {
    if (this.updatePassword.controls["currentPassword"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.updatePassword.controls["currentPassword"].hasError('pattern') ? 'At least : 1 character uppercase ,' +
      '1 character lowercase , 1 lettre , 1 symbol and 8 characters' : '';
  }

  getErrorMessageNewPassword() {
    if (this.updatePassword.controls["newPassword"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.updatePassword.controls["newPassword"].hasError('pattern') ? 'At least : 1 character uppercase ,' +
      '1 character lowercase , 1 lettre , 1 symbol and 8 characters' : '';
  }

  getErrorMessageConfirmationPassword() {
    if (this.updatePassword.controls["confirmationPassword"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.updatePassword.controls["confirmationPassword"].hasError('pattern') ? 'At least : 1 character uppercase ,' +
      '1 character lowercase , 1 lettre , 1 symbol and 8 characters' : '';
  }

  changePassword() {
    if (this.updatePassword.valid) {
    console.log(this.updatePassword.value);
    this.manager = localStorage.getItem("manager") ?? undefined;
    this.employee = localStorage.getItem("employee") ?? undefined;
    if(!this.manager && this.employee == "true"){
      this.settingServiceEmployee.changePassword(this.updatePassword.value).subscribe((data: any) => {
      console.log(data);
      if (data.status == 200) {
        Swal.fire({
          title: 'Successful update',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3500
        });
      } else {
        Swal.fire({
          title: 'Failure update',
          text: data.message,
          icon: 'warning',
          confirmButtonText: 'OK',
          timer: 3500
        });
      }
      }, (error: HttpErrorResponse) => {
      console.log(error);
      Swal.fire({
        title: 'Failure update',
        text: error.error.message,
        icon: 'warning',
        confirmButtonText: 'OK',
        timer: 3500
      });
      }
      );
    }else if(!this.employee && this.manager == "true")
      {
        this.settingServiceManager.changePassword(this.updatePassword.value).subscribe((data: any) => {
        console.log(data);
        if (data.status == 200) {
          Swal.fire({
            title: 'Successful update',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3500
          });
        } else {
          Swal.fire({
            title: 'Failure update',
            text: data.message,
            icon: 'warning',
            confirmButtonText: 'OK',
            timer: 3500
          });
        }
        }, (error: HttpErrorResponse) => {
        console.log(error);
        Swal.fire({
          title: 'Failure update',
          text: error.error.message,
          icon: 'warning',
          confirmButtonText: 'OK',
          timer: 3500
        });
        });
      }} else {
        // Afficher un message d'erreur indiquant que le formulaire n'est pas valide
        Swal.fire({
            title: 'Invalid Form',
            text: 'Please fill all required fields correctly.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3500
        });
      }
  }
}
