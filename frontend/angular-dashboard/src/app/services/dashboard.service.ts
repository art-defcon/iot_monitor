import { Injectable, OnDestroy } from '@angular/core';
import { ApiService, GatewayReading } from './api.service';
import { BehaviorSubject, Observable, interval, switchMap, tap, catchError, of, Subject, takeUntil, combineLatest, startWith, filter, distinctUntilChanged, map } from 'rxjs';
import { GatewayService } from './gateway.service'; // Import GatewayService
import { Gateway } from '../models/gateway.model'; // Import Gateway model

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
export class DashboardService implements OnDestroy { // Implement OnDestroy
  private readonly refreshIntervalMs = 15 * 60 * 1000; // 15 minutes
  private unitGroups$ = new BehaviorSubject<UnitGroup[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);
  private destroy$ = new Subject<void>(); // Subject to manage subscription cleanup

  constructor(
    private apiService: ApiService,
    private gatewayService: GatewayService // Inject GatewayService
  ) {
    // Initialize with empty data
    this.unitGroups$.next([]);

    // Create a trigger observable: combines gateway changes and the refresh interval
    const gatewayChanges$ = this.gatewayService.selectedGateway$.pipe(
      filter((gateway): gateway is Gateway => gateway !== null), // Only proceed if a gateway is selected
      map(gateway => gateway.id), // Extract the ID
      distinctUntilChanged() // Only trigger if the ID actually changes
    );

    const refreshTimer$ = interval(this.refreshIntervalMs).pipe(startWith(0)); // Start immediately then repeat

    // Combine gateway changes and timer. Trigger fetch on either.
    combineLatest([gatewayChanges$, refreshTimer$]).pipe(
      map(([gatewayId, _]) => gatewayId), // We only need the gatewayId from the combined emission
      tap(() => {
        this.loading$.next(true); // Set loading before fetching
        this.error$.next(null);   // Clear previous errors
      }),
      switchMap(gatewayId => this.fetchAndTransformReadings(gatewayId)), // Fetch data for the current gateway
      takeUntil(this.destroy$) // Unsubscribe when the service is destroyed
    ).subscribe({
      next: unitGroups => {
        this.unitGroups$.next(unitGroups);
        this.loading$.next(false);
      },
      error: err => {
        console.error("Error in dashboard data refresh pipeline:", err);
        this.error$.next(err?.message || 'Failed to load dashboard data.');
        this.loading$.next(false);
        this.unitGroups$.next([]); // Clear data on error
      }
    });

    // Handle case where gateway becomes null (deselected)
    this.gatewayService.selectedGateway$.pipe(
      filter(gateway => gateway === null),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.unitGroups$.next([]); // Clear data when no gateway is selected
      this.loading$.next(false);
      this.error$.next(null);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public getters for the observables
  getUnitGroups(): Observable<UnitGroup[]> {
    return this.unitGroups$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }

  // Renamed loadReadings to fetchAndTransformReadings for clarity
  private fetchAndTransformReadings(gatewayId: string): Observable<UnitGroup[]> {
    // Loading/error state is handled in the main pipeline tap operator
    const end = new Date().toISOString();
    // Fetch data for the last 7 days
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    console.log(`DashboardService: Fetching readings for gateway ${gatewayId} between ${start} and ${end}`); // Added logging

    return this.apiService.getReadings(gatewayId, start, end).pipe(
      map(readings => {
        console.log(`DashboardService: Received ${readings.length} readings for gateway ${gatewayId}`); // Added logging
        return this.transformToUnitGroups(readings);
      }),
      catchError(error => {
        console.error(`DashboardService: Error fetching readings for gateway ${gatewayId}:`, error); // Added logging
        // Propagate the error to the main pipeline's error handler
        throw new Error(error.message || 'Failed to fetch readings');
      })
    );
  }

  private transformToUnitGroups(readings: GatewayReading[]): UnitGroup[] {
    // Group readings by unit
    const groups = new Map<string, UnitGroup>();

    readings.forEach(reading => {
      // Ensure readingValue is a number, default to 0 if not
      const value = typeof reading.readingValue === 'number' ? reading.readingValue : 0;
      const unit = reading.unit || 'Unknown'; // Handle null/undefined unit
      const sensorId = reading.sensorLabel || `unknown-sensor-${Math.random()}`; // Handle null/undefined sensorLabel
      const sensorName = reading.sensorLabel || 'Unknown Sensor'; // Use label as name, provide default

      this.addReadingToGroup(
        groups,
        unit,
        sensorId,
        sensorName,
        reading.timestamp,
        value
      );
    });

    // Sort sensors within each group alphabetically by name
    groups.forEach(group => {
      group.sensors.sort((a, b) => a.name.localeCompare(b.name));
      // Optional: Sort readings by timestamp if needed (descending)
      // group.sensors.forEach(sensor => {
      //   sensor.readings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      // });
    });

    // Sort unit groups alphabetically by unit name
    return Array.from(groups.values()).sort((a, b) => a.unit.localeCompare(b.unit));
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

    // Ensure readings are numbers
    if (typeof value === 'number' && !isNaN(value)) {
       sensor.readings.push({ timestamp, value });
    } else {
       console.warn(`Skipping non-numeric reading for sensor ${sensorName} (${sensorId}):`, value);
    }
  }

  // Remove the old startAutoRefresh method as it's replaced by the constructor logic
  // startAutoRefresh(gatewayId: string): void { ... }

  // Remove the old loadReadings method as it's replaced by fetchAndTransformReadings
  // private loadReadings(gatewayId: string): Observable<UnitGroup[]> { ... }
}
