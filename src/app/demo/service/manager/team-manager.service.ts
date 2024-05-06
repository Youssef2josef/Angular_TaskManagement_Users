import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamManagerService {

  constructor(private http: HttpClient) { }
  teamUrl: string="http://localhost:8050/api/managers/team";
  microTeamUrl: string="http://localhost:8050/api/team/microservice";

  //Normal Methods
  getTeamByName(name:string): Observable<any> {
    return this.http.post(`${this.teamUrl}/name?teamName=${name}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  addTeam(team:any): Observable<any> {
    return this.http.post(this.teamUrl+"/create-with-head",team).pipe(
      catchError(this.handleError)
    );
  }

  insertEmployeeToTeam(idTeam:any,idEmp:any,token:string): Observable<any> {
    return this.http.get(this.teamUrl+"/"+idTeam+"/employee/"+idEmp+"?token="+token).pipe(
      catchError(this.handleError)
    );
  }

  getTeamById(id:any): Observable<any> {
    return this.http.get(this.teamUrl+"/"+id).pipe(
      catchError(this.handleError)
    );
  }

  updateEmployeeStatusInTeam(request:any): Observable<any> {
    return this.http.post(this.teamUrl+"/update/Employee-team/status",request).pipe(
      catchError(this.handleError)
    );
  }

  updateTeamStatus(UpdateEmployeeTeam:any): Observable<any> {
    return this.http.post(this.teamUrl+"/update/status",UpdateEmployeeTeam).pipe(
      catchError(this.handleError)
    );
  }

  updateTeam(team:any,token:string): Observable<any> {
    return this.http.put(this.teamUrl+"/edit",team+"?token="+token).pipe(
      catchError(this.handleError)
    );
  }

  insertProjectToTeam(InsertTeamProject:any): Observable<any> {
    return this.http.post(this.teamUrl+"/insert/project",InsertTeamProject).pipe(
      catchError(this.handleError)
    );
  }

  getAllTeams(): Observable<any> {
    return this.http.get(this.teamUrl+"/all-teams").pipe(
      catchError(this.handleError)
    );
  }

  findAllTeamsByHead(id:any): Observable<any> {
    return this.http.get(this.teamUrl+"/manager/"+id).pipe(
      //catchError(this.handleError)
    );
  }

  findAllRecentTeamsByHead(id:any): Observable<any> {
    return this.http.get(this.teamUrl+"/"+id+"/recent").pipe(
      catchError(this.handleError)
    );
  }

  finishTeamTime(id:any,token:string): Observable<any> {
    return this.http.put(this.teamUrl+"/finish-team/"+id+"?token="+token,null).pipe(
      catchError(this.handleError)
    );
  }

  //Microservice Methods
  findAllTeamsByEmployee(id:any): Observable<any> {
    return this.http.get(this.microTeamUrl+"/"+id).pipe(
      catchError(this.handleError)
    );
  }

  findAllTeamsByProject(nameProject: string): Observable<any> {
    return this.http.get<any>(this.microTeamUrl+"?name="+nameProject).pipe(
      catchError(this.handleError)
    );
  }

  getAllPopularTeams(): Observable<any> {
    return this.http.get(this.teamUrl+"/popular").pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
