import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoEmployeeService {

  constructor(private http: HttpClient) { }
  infohUrl: string="http://localhost:8090/api/employe/auth";

  getInfoAdmin(email:any){
    return this.http.post(this.infohUrl+"/info",email);
  }
}
