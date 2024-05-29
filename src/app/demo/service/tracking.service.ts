import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TrackingModel {
  id: number;
  actionName: string;
  actionTime: string;
  user: { id: number; name: string }; // ajustez en fonction de la structure de votre modèle User
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private apiEmployeeUrl = 'http://localhost:8090/api/employee/suivi';
  private apiManagerUrl = 'http://localhost:8050/api/manager/suivi';


  constructor(private http: HttpClient) {}

  getTrackingsEmployee(id: number): Observable<TrackingModel[]> {
    return this.http.get<TrackingModel[]>(this.apiEmployeeUrl+"/"+id);
  }

  getTrackingsManager(id: number): Observable<TrackingModel[]> {
    return this.http.get<TrackingModel[]>(this.apiManagerUrl+"/"+id);
  }
}