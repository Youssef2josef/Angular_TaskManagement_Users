import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';

@Component({
  selector: 'app-other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss']
})
export class OtherInfoComponent implements OnInit {

  findedInfo!: FormGroup;

  thirdFormGroup = this.formBuilder.group({
    emailRecuperation: ['', Validators.compose([Validators.email, Validators.required])],
  });

  constructor(private formBuilder: FormBuilder, private router:Router,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {
    this.findedInfo = this.sharedDataService.otherInfoData;
  }

  getErrorEmailRec() {

    if (this.thirdFormGroup.controls["emailRecuperation"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.thirdFormGroup.controls["emailRecuperation"].hasError('email') ? 'Not a valid email' : '';

  }

  proceed(){
    this.sharedDataService.otherInfoData = this.thirdFormGroup;
    console.log(this.thirdFormGroup.value);
    this.router.navigate(['/register/confirmation']);
  }

}
