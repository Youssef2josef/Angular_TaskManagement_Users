import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingAccountService {

  constructor(private http: HttpClient) { }
  settingUrl: string = "http://localhost:8090/api/settings/employee";

  changePassword(request:any){
    return this.http.patch(this.settingUrl + "/password",request);
  }
}
