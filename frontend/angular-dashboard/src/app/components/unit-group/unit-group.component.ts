import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { SensorChartComponent } from '../sensor-chart/sensor-chart.component';
import { ApiService } from '../../services/api.service';

interface Sensor {
  id: string;
  name: string;
  readings: Reading[];
  lastReading?: Reading;
}

interface Reading {
  value: number;
  timestamp: string;
}

interface UnitGroup {
  unit: string;
  sensors: Sensor[];
}

@Component({
  selector: 'app-unit-group',
  templateUrl: './unit-group.component.html',
  styleUrls: ['./unit-group.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule,
    SensorChartComponent,
    TitleCasePipe
  ]
})
export class UnitGroupComponent implements OnInit {
  @Input() gatewayId!: string;
  
  isLoading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);
  unitGroups$: Observable<UnitGroup[]> = of([]);
  
  // Skeleton data for placeholder UI
  skeletonGroups: UnitGroup[] = [
    {
      unit: 'celsius',
      sensors: [
        { id: 'temp-1', name: 'Temperature Sensor 1', readings: [] },
        { id: 'temp-2', name: 'Temperature Sensor 2', readings: [] },
        { id: 'temp-3', name: 'Temperature Sensor 3', readings: [] },
        { id: 'temp-4', name: 'Temperature Sensor 4', readings: [] }
      ]
    },
    {
      unit: 'percent',
      sensors: [
        { id: 'hum-1', name: 'Humidity Sensor 1', readings: [] },
        { id: 'hum-2', name: 'Humidity Sensor 2', readings: [] },
        { id: 'hum-3', name: 'Humidity Sensor 3', readings: [] },
        { id: 'hum-4', name: 'Humidity Sensor 4', readings: [] }
      ]
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // In a real implementation, this would fetch data from the API
    this.isLoading$ = of(false);
    this.error$ = of(null);
    
    // Check if we have a valid gatewayId
    if (this.gatewayId) {
      // Fetch real data from API
      this.fetchSensorData();
    } else {
      // Use placeholder data
      this.unitGroups$ = of([]);
    }
  }

  /**
   * Fetch sensor data from the API
   */
  private fetchSensorData(): void {
    // In a real implementation, this would make an API call
    // For now, we'll just use the mock data
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Example of how to fetch data from API
    // this.apiService.get<any[]>(`/readings/${this.gatewayId}?start=${start}&end=${end}`)
    //   .subscribe({
    //     next: (data) => {
    //       // Transform data into unit groups
    //       const unitGroups = this.transformToUnitGroups(data);
    //       this.unitGroups$ = of(unitGroups);
    //       this.isLoading$ = of(false);
    //     },
    //     error: (err) => {
    //       this.error$ = of(err.message || 'Failed to load sensor data');
    //       this.isLoading$ = of(false);
    //     }
    //   });
    
    // For now, we'll just use mock data
    this.unitGroups$ = of([
      {
        unit: 'volts',
        sensors: [
          {
            id: 'voltage-1',
            name: 'Voltage Sensor',
            readings: [
              { value: 11.01, timestamp: new Date(Date.now() - 600000).toISOString() },
              { value: 13.06, timestamp: new Date(Date.now() - 300000).toISOString() },
              { value: 13.1, timestamp: new Date().toISOString() }
            ]
          }
        ]
      }
    ]);
  }

  /**
   * Calculate total number of sensors across all unit groups
   */
  getTotalSensors(unitGroups: UnitGroup[]): number {
    return unitGroups.reduce((total, group) => total + group.sensors.length, 0);
  }

  /**
   * Get appropriate Material icon based on the unit type
   */
  getUnitIcon(unit: string): string {
    const icons: { [key: string]: string } = {
      'celsius': 'thermostat',
      'fahrenheit': 'thermostat',
      'percent': 'water_drop',
      'ppm': 'air',
      'lux': 'light_mode',
      'meters': 'straighten',
      'hpa': 'compress',
      'volts': 'electric_bolt',
      'amps': 'electrical_services',
      'watts': 'bolt',
      'decibels': 'volume_up'
    };
    
    return icons[unit.toLowerCase()] || 'sensors';
  }

  /**
   * Get descriptive text about each unit type
   */
  getUnitDescription(unit: string): string {
    const descriptions: { [key: string]: string } = {
      'celsius': 'Temperature measurements in degrees Celsius (°C)',
      'fahrenheit': 'Temperature measurements in degrees Fahrenheit (°F)',
      'percent': 'Relative measurements shown as percentages (%)',
      'ppm': 'Concentration measurements in parts per million (PPM)',
      'lux': 'Light intensity measurements in lux',
      'meters': 'Distance measurements in meters',
      'hpa': 'Pressure measurements in hectopascals (hPa)',
      'volts': 'Voltage measurements in volts (V)',
      'amps': 'Current measurements in amperes (A)',
      'watts': 'Power measurements in watts (W)',
      'decibels': 'Sound level measurements in decibels (dB)'
    };
    
    return descriptions[unit.toLowerCase()] || `Measurements in ${unit}`;
  }

  /**
   * Determine CSS class for sensor status indicator
   */
  getSensorStatusClass(sensor: Sensor): string {
    if (!sensor.readings || sensor.readings.length === 0) {
      return 'status-inactive';
    }
    
    // Get the latest reading timestamp
    const latestReading = sensor.readings[sensor.readings.length - 1];
    const readingTime = new Date(latestReading.timestamp).getTime();
    const now = Date.now();
    const timeDiff = now - readingTime;
    
    // If reading is less than 5 minutes old, consider it active
    if (timeDiff < 5 * 60 * 1000) {
      return 'status-active';
    } 
    // If reading is less than 1 hour old, consider it warning
    else if (timeDiff < 60 * 60 * 1000) {
      return 'status-warning';
    } 
    // Otherwise, consider it inactive/stale
    else {
      return 'status-inactive';
    }
  }
}
