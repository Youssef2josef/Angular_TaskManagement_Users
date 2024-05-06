import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoManagerService {

  constructor(private http: HttpClient) { }
  infohUrl: string="http://localhost:8050/api/manager/auth";

  getInfoAdmin(email:any){
    return this.http.post(this.infohUrl+"/info",email);
  }
}
