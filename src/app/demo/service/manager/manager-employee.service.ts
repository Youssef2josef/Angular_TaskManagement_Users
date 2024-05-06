import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerEmployeeService {

  constructor(private http: HttpClient) { }
  employeeUrl: string="http://localhost:8050/api/manager/employees";

  getAllEmployees(): Observable<any> {
    return this.http.get(this.employeeUrl);
  }

  getEmployeeById(id:any): Observable<any>{
    return this.http.get(this.employeeUrl + "/" + id);
  }

  getEmployeeByEmail(email:string): Observable<any>{
    return this.http.post(`${this.employeeUrl}?email=${email}`, {});
  }
}
