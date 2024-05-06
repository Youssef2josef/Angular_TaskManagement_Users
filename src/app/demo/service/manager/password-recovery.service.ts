import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService {

  constructor(private http: HttpClient) { }
  recoveryPasswordUrl: string = "http://localhost:8050/api/manager/recovery/password";

  emailRecovery(recoveryReq:string): Observable<any> {
    return this.http.post(this.recoveryPasswordUrl+"/email",recoveryReq).pipe(
      catchError(this.handleError)
    );
  }

  phoneRecovery(recoveryReq:string): Observable<any> {
    return this.http.post(this.recoveryPasswordUrl+"/phone",recoveryReq).pipe(
      catchError(this.handleError)
    );
  }

  keyPhoneRecovery(recoveryReq:string): Observable<any> {
    return this.http.post(this.recoveryPasswordUrl+"/key-phone",recoveryReq).pipe(
      catchError(this.handleError)
    );
  }

  changerForgottonPassword(recoveryReq:string): Observable<any> {
    return this.http.patch(this.recoveryPasswordUrl+"/forgotten-password",recoveryReq).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
