import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingAccountManagerService {

  constructor(private http: HttpClient) { }
  settingUrl: string = "http://localhost:8050/api/settings/manager";

  changePassword(request:any){
    return this.http.patch(this.settingUrl + "/password",request);
  }
}
