import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

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
  // Flag to control whether to use mock data or real API
  private useMockData = true;

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  get<T>(url: string): Observable<T> {
    if (this.useMockData && url.includes('/api/ingestion/gateways')) {
      console.log('Using mock data service for gateways');
      return this.mockDataService.getGateways() as unknown as Observable<T>;
    }
    
    console.log('Using real API for get request:', url);
    return this.http.get<T>(`${environment.apiUrl}${url}`);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${url}`);
  }

  getReadings(gatewayId: string, start: string, end: string): Observable<GatewayReading[]> {
    if (this.useMockData) {
      console.log('Using mock data service for readings');
      return this.mockDataService.getReadings(gatewayId, start, end);
    }

    console.log('Using real API for readings');
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    
    return this.http.get<GatewayReading[]>(
      `${environment.apiUrl}/api/ingestion/readings/${gatewayId}`,
      { params }
    );
  }

  // Method to toggle between mock and real data
  toggleMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  // Check if we're using mock data
  isUsingMockData(): boolean {
    return this.useMockData;
  }
}
