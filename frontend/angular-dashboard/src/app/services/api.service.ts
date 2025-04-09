import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GatewayReading {
  readingId: string;
  timestamp: string;
  sensorLabel: string;
  unit: string;
  readingValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${url}`);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${url}`);
  }

  getReadings(gatewayId: string, start: string, end: string): Observable<GatewayReading[]> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    
    return this.http.get<GatewayReading[]>(
      `${environment.apiUrl}/api/ingestion/readings/${gatewayId}`,
      { params }
    );
  }
}
