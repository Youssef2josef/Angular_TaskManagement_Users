import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthEmployeeService {

  constructor(private http: HttpClient) { }

  authUrl: string="http://localhost:8090/api/employe/auth";
  logoutUrl: string="http://localhost:8090/employee/auth";

  login(admin: any){
    return this.http.post(this.authUrl+"/authenticate",admin)
  }

  verifyKey(key:any){
    return this.http.post(this.authUrl+"/key",key)
  }

  verifyQrCode(QrCode:any){
    return this.http.post(this.authUrl+"/verify",QrCode)
  }

  logout(token: String): Observable<any>{
    return this.http.post(`${this.logoutUrl}/logout?token=${token}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  signup(user: any):Observable<any> {
    return this.http.post(this.authUrl + "/register", user).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error); // Log erreur
    return throwError(error || 'Server error');
  }

}
