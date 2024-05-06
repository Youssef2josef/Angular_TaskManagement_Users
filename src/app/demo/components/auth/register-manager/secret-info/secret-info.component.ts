import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';

@Component({
  selector: 'app-secret-info',
  templateUrl: './secret-info.component.html',
  styleUrls: ['./secret-info.component.scss']
})
export class SecretInfoComponent implements OnInit {

  findedInfo!: FormGroup

  hide = true;

  constructor(private formBuilder: FormBuilder,private router: Router,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {
    this.findedInfo = this.sharedDataService.secretInfoData;
  }

  secondFormGroup = this.formBuilder.group({
    email: ['', Validators.compose([Validators.email, Validators.required])],
    password: ['',Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)])],
    numTel: ['',Validators.compose([Validators.required])],
  });

  getErrorNumTel() {
    return this.secondFormGroup.controls["numTel"].hasError('required') ? 'You must enter a value' : '';
  }

  getErrorEmail() {
    if (this.secondFormGroup.controls["email"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.secondFormGroup.controls["email"].hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassword() {
    if (this.secondFormGroup.controls["password"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.secondFormGroup.controls["password"].hasError('pattern') ? 'Minimum 8 letters :At least one character majus , minus , symbol and number' : '';
  }

  back(){
    this.router.navigate(['/register/manager/manager-personal']);
  }

  proceed(){
    this.sharedDataService.secretInfoData = this.secondFormGroup;
    console.log(this.secondFormGroup.value);
    this.router.navigate(['/register/manager/manager-other-info']);
  }

}
