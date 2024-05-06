import { SharedDataService } from './../../../../service/shared-data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  findedInfo!: FormGroup;

  firstFormGroup = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private router:Router,
    private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this.findedInfo = this.sharedDataService.personalInfoData;
  }

  getErrorFirstName() {
    return this.firstFormGroup.controls["firstname"].hasError('required') ? 'Value Required' : '';
  }

  getErrorLastName() {
    return this.firstFormGroup.controls["lastname"].hasError('required') ? 'Value Required' : '';
  }

  proceed(){
    console.log(this.firstFormGroup.value);
    this.sharedDataService.personalInfoData = this.firstFormGroup;
    this.router.navigate(['/register/secret-info']);
  }

}
