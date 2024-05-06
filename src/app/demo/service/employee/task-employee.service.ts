import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskEmployeeService {

  constructor(private http: HttpClient) { }
  microTaskUrl: string="http://localhost:8090/api/task/employee";

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
    return this.http.post(`${this.microTaskUrl}/insert-user-task?token=`+token, insertUserTask).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
