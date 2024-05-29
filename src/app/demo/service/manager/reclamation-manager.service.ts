import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationManagerService {

  constructor(private http: HttpClient) { }

  reclamationUrl: string="http://localhost:8050/api/manager/microservice/reclamation";

  getReclamationsByManager(email:String) : Observable<any>{
    return this.http.post(this.reclamationUrl+"/all-manager?email="+email,null).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    //console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
