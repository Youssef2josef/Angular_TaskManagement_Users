import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthManagerService } from 'src/app/demo/service/manager/auth-manager.service';
import { RolesManagerService } from 'src/app/demo/service/roles-manager.service';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-last-step',
  templateUrl: './last-step.component.html',
  styleUrls: ['./last-step.component.scss']
})
export class LastStepComponent implements OnInit {

  forthFormGroup = this.formBuilder.group({
    role: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
  });

  roles: any;

  constructor(private roleService: RolesManagerService,private formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,private authMnagerService: AuthManagerService,
    private router:Router) { }

  ngOnInit(){
    this.getRoles();
  }

  getRoles(){
    return this.roleService.getRolesManager().subscribe(
      (data: any) => {
        this.roles = data;
        console.log(this.roles);
      },
      (error:any)=>{
        console.log(error);
      }
    );
  }

  getErrorRole() {
    return this.forthFormGroup.controls["role"].hasError('required') ? 'Value Required' : '';
  }

  proceed(){
    const personalInfo = this.sharedDataService.personalInfoData?.value;
    const secretInfo = this.sharedDataService.secretInfoData?.value;
    const otherInfo = this.sharedDataService.otherInfoData?.value;

    console.log(secretInfo,personalInfo,otherInfo);

    console.log(this.forthFormGroup.value);
    const address = this.forthFormGroup.value.address;
    const city = this.forthFormGroup.value.city;
    const state = this.forthFormGroup.value.state;
    const zip = this.forthFormGroup.value.zip;
    const req = {
      firstname: personalInfo?.firstname,
      lastname: personalInfo?.lastname,
      email: secretInfo?.email,
      password: secretInfo?.password,
      emailRecuperation: otherInfo?.emailRecuperation,
      numTel: secretInfo?.numTel,
      role: this.forthFormGroup?.value.role,
      adresse: `${address}, ${city}, ${state}, ${zip}`,
    }
    console.log(req);
    this.authMnagerService.signup(req).subscribe((res:any)=> {
      console.log(res);
      if(res.status == 201){
        Swal.fire({
          title: 'Successful Registration',
          text: res.message,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3500
        });
        this.router.navigate([""]);
      }
    },(error:HttpErrorResponse)=>{
      if(error.error){
        Swal.fire({
          title: 'Bad Request Info',
          text: error?.error,
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 5000
        });
        this.router.navigate(["/register/manager/manager-personal"]);
      }else{
          Swal.fire({
          title: 'Internal Server Error',
          text: 'Please contact the responsable.We will look forward to fix it',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 5000
          });
          this.router.navigate(["/register/manager/manager-personal"]);
        }
    });
  }

  return(){
    this.router.navigate(["/register/manager/manager-personal"]);
  }

}
