import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectEmployeeService {

  constructor(private http: HttpClient) { }
  microProjectUrl: string="http://localhost:8090/api/employee/project";

  findAllProjects(): Observable<any> {
    return this.http.get(this.microProjectUrl+"/all-projects").pipe(
      catchError(this.handleError)
    );
  }
private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
