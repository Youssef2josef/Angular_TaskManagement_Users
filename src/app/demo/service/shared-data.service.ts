import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  personalInfoData: any;
  secretInfoData: any;
  otherInfoData: any;

  constructor() { }
}
