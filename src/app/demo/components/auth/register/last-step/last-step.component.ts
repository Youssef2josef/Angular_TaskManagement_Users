import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RolesEmployeeService } from 'src/app/demo/service/roles-employee.service';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';
import { AuthEmployeeService } from 'src/app/demo/service/employee/auth-employee.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private roleService: RolesEmployeeService,private formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,private authEmployeeService:AuthEmployeeService,
    private router:Router) { }

  ngOnInit(){
    this.getRoles();
  }

  getRoles(){
    return this.roleService.getRolesEmployee().subscribe(
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

    //console.log(secretInfo,personalInfo,otherInfo);

    //console.log(this.forthFormGroup.value);
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
    //console.log(req);
    this.authEmployeeService.signup(req).subscribe((res:any)=> {
      console.log(res);
      if(res.status == 201){
        Swal.fire({
          title: 'Successful Registration',
          text: res.message,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 5000
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
        this.router.navigate(["/register/personal"]);
      }else{
          Swal.fire({
          title: 'Internal Server Error',
          text: 'Please contact the responsable.We will look forward to fix it',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 5000
          });
          this.router.navigate(["/register/personal"]);
        }
    });
  }

  return(){
    this.router.navigate(["/register/personal"]);
  }

}
