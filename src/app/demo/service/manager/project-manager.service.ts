import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {

  constructor(private http: HttpClient) { }

  projectUrl: string="http://localhost:8050/api/managers/project";
  projectMicroUrl: string="http://localhost:8050/api/project/microservice";

  //normal CRUD methods for projects
  getAllProjects() : Observable<any>{
    return this.http.get(this.projectMicroUrl+"/all-projects").pipe(
      catchError(this.handleError)
    );
  }
  
  addProject(data:any, token:string|null) : Observable<any>{
    return this.http.post(this.projectUrl+'/create?token='+token, data).pipe(
      catchError(this.handleError)
    )
  }

  updateProject(data:any,token:string|null) : Observable<any>{
    return this.http.put(this.projectUrl+"/edit?token="+token, data).pipe(
      catchError(this.handleError)
    )
  }

  findProjectById(id:any) : Observable<any>{
    return this.http.get(this.projectUrl + "/"+ id).pipe(
      catchError(this.handleError)
    )
  }

  finishProjectTime(id:any,token:string|null) : Observable<any>{
    return this.http.put(this.projectUrl+"/finish-project/"+id+"?token="+token,null).pipe(
      catchError(this.handleError)
    )
  }

  inactivateProject(name:String, status:boolean, token:string|null) : Observable<any>{
    return this.http.put(this.projectUrl + "/status?name-project=" + name + "&status-project=" + status + "?token?" +
     token , null).pipe(
      catchError(this.handleError)
    )
  }

  //microservice method
  getRecentProjects() : Observable<any>{
    return this.http.get(this.projectMicroUrl +"/recent").pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    //console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
