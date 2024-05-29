import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ReportEmployeeService {

  constructor(private http: HttpClient) { }

  reportUrl: string="http://localhost:8090/api/employee/report";

  createReport(body:any) : Observable<any>{
    return this.http.post(this.reportUrl+'/create', body).pipe(
      catchError(this.handleError)
    )
  }

  myReports(email:string) : Observable<any>{
    return this.http.get(this.reportUrl+'/all-reports/user?email='+email).pipe(
      catchError(this.handleError)
    )
  }

  downloadRapport(id: any, report: any): void {
    const firstName = report.user.firstName;
    const lastName = report.user.lastName;
    const creationDate = new Date(report.dateCreation).toISOString().split('T')[0]; // Obtient la date de création au format AAAA-MM-JJ

    this.http.get(`${this.reportUrl}/${id}/download`, { responseType: 'blob', observe: 'response' })
      .subscribe(response => {
        console.log(response);
        const filename = `${firstName}-${lastName}_Rapport_${creationDate}.pdf` || "rapport.pdf";
        const fileBlob = response.body;
        if (fileBlob) {
          saveAs(fileBlob, filename);
        } else {
          console.error('Le contenu du fichier est null.');
        }
      });
  }

  private handleError(error: HttpErrorResponse) {
    //console.error('An error occurred', error); // Log erreur
    return throwError(error.error || 'Server error');
  }
}
