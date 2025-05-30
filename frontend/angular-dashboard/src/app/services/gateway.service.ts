import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Gateway } from '../models/gateway.model';
import { ApiService } from './api.service';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private selectedGateway = new BehaviorSubject<Gateway | null>(null);
  selectedGateway$ = this.selectedGateway.asObservable();
  gatewaySelected = new EventEmitter<Gateway>();

  constructor(
    private apiService: ApiService,
    private mockDataService: MockDataService
  ) {}

  getGateways(): Observable<Gateway[]> {
    if (this.apiService.isUsingMockData()) {
      return this.mockDataService.getGateways();
    }
    return this.apiService.get<Gateway[]>('/api/ingestion/gateways');
  }

  fetchGateways(): void {
    if (this.apiService.isUsingMockData()) {
      this.mockDataService.getGateways().pipe(
        tap(gateways => {
          if(gateways.length > 0) {
            this.selectedGateway.next(gateways[0]);
            this.gatewaySelected.emit(gateways[0]);
          }
        })
      ).subscribe();
      return;
    }

    this.apiService.get<Gateway[]>('/api/ingestion/gateways').pipe(
      tap(gateways => {
        if(gateways.length > 0) {
          this.selectedGateway.next(gateways[0]);
          this.gatewaySelected.emit(gateways[0]);
        }
      })
    ).subscribe();
  }

  getGateway(id: string): Observable<Gateway> {
    if (this.apiService.isUsingMockData()) {
      return this.mockDataService.getGateway(id);
    }
    return this.apiService.get<Gateway>(`/api/ingestion/gateways/${id}`);
  }

  deleteGateway(id: string): Observable<void> {
    return this.apiService.delete<void>(`/api/ingestion/gateways/${id}`);
  }

  setSelectedGateway(gateway: Gateway | null): void {
    this.selectedGateway.next(gateway);
  }
}
