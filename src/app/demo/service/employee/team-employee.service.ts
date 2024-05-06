import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamEmployeeService {

  constructor(private http: HttpClient) { }
  microTeamUrl: string="http://localhost:8090/api/employee/team";

  findAllTeamsByEmployee(id:any): Observable<any> {
    return this.http.get(this.microTeamUrl+"/"+id).pipe(
      catchError(this.handleError)
    );
  }

  findRecentTeamsByEmployee(id:any): Observable<any> {
    return this.http.get(this.microTeamUrl+"/"+id+"/recent").pipe(
      catchError(this.handleError)
    );
  }

  findAllTeamsByProject(nameProject: string): Observable<any> {
    return this.http.get<any>(this.microTeamUrl+"?name="+nameProject).pipe(
      catchError(this.handleError)
    );
  }

  getAllPopularTeams(): Observable<any> {
    return this.http.get(this.microTeamUrl+"/popular/client").pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
