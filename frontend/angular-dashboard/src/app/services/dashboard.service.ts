import { Injectable } from '@angular/core';
import { ApiService, GatewayReading } from './api.service';
import { BehaviorSubject, Observable, interval, switchMap, tap, catchError, of } from 'rxjs';

export interface UnitGroup {
  unit: string;
  sensors: {
    id: string;
    name: string;
    readings: {
      timestamp: string;
      value: number;
    }[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly refreshInterval = 15 * 60 * 1000; // 15 minutes
  private unitGroups$ = new BehaviorSubject<UnitGroup[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private apiService: ApiService) {
    // Initialize with empty data
    this.unitGroups$.next([]);
  }

  startAutoRefresh(gatewayId: string): void {
    // Check if this is the default gateway ID
    if (gatewayId === 'default-gateway-id' || gatewayId === '81380b79-d725-4e80-baa7-0fe82cf0993e') {
      console.log('Using default gateway ID, loading mock data');
      this.loading$.next(true);
      
      // Simulate loading delay
      setTimeout(() => {
        // Use the first gateway from mock data
        this.loadReadings('81380b79-d725-4e80-baa7-0fe82cf0993e');
      }, 1000);
      
      return;
    }
    
    // Initial load
    this.loadReadings(gatewayId);

    // Set up periodic refresh
    interval(this.refreshInterval).pipe(
      tap(() => this.loading$.next(true)),
      switchMap(() => this.loadReadings(gatewayId))
    ).subscribe();
  }

  getUnitGroups(): Observable<UnitGroup[]> {
    return this.unitGroups$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }

  private loadReadings(gatewayId: string): Observable<UnitGroup[]> {
    this.loading$.next(true);
    this.error$.next(null);

    const end = new Date().toISOString();
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    return this.apiService.getReadings(gatewayId, start, end).pipe(
      tap(readings => {
        const unitGroups = this.transformToUnitGroups(readings);
        this.unitGroups$.next(unitGroups);
        this.loading$.next(false);
      }),
      catchError(error => {
        this.error$.next(error.message);
        this.loading$.next(false);
        return of([]);
      }),
      switchMap(() => this.unitGroups$)
    );
  }

  private transformToUnitGroups(readings: GatewayReading[]): UnitGroup[] {
    // Group readings by unit
    const groups = new Map<string, UnitGroup>();

    readings.forEach(reading => {
      this.addReadingToGroup(
        groups, 
        reading.unit, 
        reading.sensorLabel, 
        reading.sensorLabel, // Use sensor label as name
        reading.timestamp, 
        reading.readingValue
      );
    });

    return Array.from(groups.values());
  }

  private addReadingToGroup(
    groups: Map<string, UnitGroup>,
    unit: string,
    sensorId: string,
    sensorName: string,
    timestamp: string,
    value: number
  ): void {
    if (!groups.has(unit)) {
      groups.set(unit, { unit, sensors: [] });
    }

    const group = groups.get(unit)!;
    let sensor = group.sensors.find(s => s.id === sensorId);

    if (!sensor) {
      sensor = { id: sensorId, name: sensorName, readings: [] };
      group.sensors.push(sensor);
    }

    sensor.readings.push({ timestamp, value });
  }
}
