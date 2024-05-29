import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  constructor(private http: HttpClient) { }

  reclamationUrl: string="http://localhost:8090/api/employe/reclamation";

  getReclamationsByEmployee(email:String) : Observable<any>{
    return this.http.post(this.reclamationUrl+"/all?email="+email,null).pipe(
      catchError(this.handleError)
    );
  }

  addReclamation(request:any) : Observable<any>{
    return this.http.post(this.reclamationUrl + "/create", request).pipe(
      catchError(this.handleError)
    )
  }

  findReclamationById(id:number) : Observable<any>{
    return this.http.get(this.reclamationUrl+"/"+id).pipe(
      catchError(this.handleError)
      )
  }

  editReclamation(request:any) : Observable<any>{
    return this.http.put(this.reclamationUrl+'/update', request).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    //console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
