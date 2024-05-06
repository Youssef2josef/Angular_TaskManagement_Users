import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, map } from "rxjs";

const TOKEN_KEY = "auth-token";
const USER_KEY = "email";
const Admin_role = "admin";
const Employee_role = "employee";
const Manager_role = "manager";

@Injectable({
providedIn: "root",
})
export class TokenStorageService {
  constructor(private http: HttpClient, private router: Router){}

  managerTokenUrl: string = "http://localhost:8050/api/manager/auth";
  employeeTokenUrl: string = "http://localhost:8090/api/employe/auth";

  validateTokenManager(token: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams();
    body.set('token', token);

    return this.http.post<any>(this.managerTokenUrl + "/validateToken", body.toString(), { headers }).pipe(
      map(response => {
        // Assuming your API returns a boolean directly
        return response as boolean;
      })
    );
  }

  validateTokenEmployee(token: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams();
    body.set('token', token);

    return this.http.post<any>(this.employeeTokenUrl + "/validateToken", body.toString(), { headers }).pipe(
      map(response => {
        // Assuming your API returns a boolean directly
        return response as boolean;
      })
    );
  }

  signOut() {
    localStorage.clear();
  }

  public saveToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token !== null ? token : null;
  }

  public saveUser(user:any) {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY,user);
  }

  public getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user !== null ? user : null;
  }

  public saveAdmin(admin:any) {
    localStorage.removeItem(Admin_role);
    localStorage.setItem(Admin_role,admin);
  }

  public getAdmin() {
    const user = localStorage.getItem(Admin_role);
    return user !== null ? user : null;
  }

  public saveEmployee(employee:any) {
    localStorage.removeItem(Employee_role);
    localStorage.setItem(Employee_role,employee);
  }

  public getEmployee() {
    const user = localStorage.getItem(Employee_role);
    return user !== null ? user : null;
  }

  public saveManager(manager:any) {
    localStorage.removeItem(Manager_role);
    localStorage.setItem(Manager_role,manager);
  }

  public getManager() {
    const user = localStorage.getItem(Manager_role);
    return user !== null ? user : null;
  }

}

