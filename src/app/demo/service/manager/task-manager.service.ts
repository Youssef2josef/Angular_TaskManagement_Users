import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {

  constructor(private http: HttpClient) { }
  taskUrl: string="http://localhost:8050/api/managers/task";
  microTaskUrl: string="http://localhost:8050/api/task/microservice";

  //Normal Methods
  createTaskWithoutProjectOrUser(creationTask:any): Observable<any> {
    return this.http.post(`${this.taskUrl}/create`, creationTask).pipe(
      catchError(this.handleError)
    );
  }

  updateTaskStatus(updateTask:any): Observable<any> {
    return this.http.post(`${this.taskUrl}/update`, updateTask).pipe(
      catchError(this.handleError)
    );
  }

  insertProjectToTask(insertProjectTask:any): Observable<any> {
    return this.http.post(`${this.taskUrl}/insert-project-task`, insertProjectTask).pipe(
      catchError(this.handleError)
    );
  }

  editTask(editTask:any): Observable<any> {
    return this.http.put(`${this.taskUrl}/edit`, editTask).pipe(
      catchError(this.handleError)
    );
  }

  finishTask(id:number,token:string): Observable<any> {
    return this.http.post(this.taskUrl+"/finish/"+id+"?token="+token,null).pipe(
      catchError(this.handleError)
    )
  }

  //microservice Methods
  findTaskById(id:any): Observable<any>{
    return this.http.get(`${this.microTaskUrl}/`+id).pipe(
      catchError(this.handleError)
    );
  }

  getAllTasks(): Observable<any>{
    return this.http.get(`${this.microTaskUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  insertUserToTask(insertUserTask:any,token:string): Observable<any> {
    return this.http.post(this.microTaskUrl+"/insert-user-task?token="+token,insertUserTask).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error);
    return throwError(error.error || 'Server error');
  }
}
