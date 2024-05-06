import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesManagerService {

  constructor(private http: HttpClient) { }
  roleUrl: string="http://localhost:8050/roles";

  getRolesManager(): Observable<any> {
    return this.http.get(this.roleUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
