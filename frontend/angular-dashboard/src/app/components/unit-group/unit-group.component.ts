import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';
import { SensorChartComponent } from '../sensor-chart/sensor-chart.component';
import { DashboardService, UnitGroup } from '../../services/dashboard.service';

interface Sensor {
  id: string;
  name: string;
  readings: {
    timestamp: string;
    value: number;
  }[];
}

interface Reading {
  timestamp: string;
  value: number;
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
    TitleCasePipe,
    DecimalPipe
  ]
})
export class UnitGroupComponent implements OnInit, OnDestroy {
  @Input() gatewayId!: string;
  
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  unitGroups$: Observable<UnitGroup[]>;
  
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
  
  private subscription: Subscription | null = null;

  constructor(private dashboardService: DashboardService) {
    // Initialize mock data for skeleton UI
    this.initializeSkeletonGroups();
    this.isLoading$ = this.dashboardService.isLoading();
    this.error$ = this.dashboardService.getError();
    this.unitGroups$ = this.dashboardService.getUnitGroups();
  }

  ngOnInit(): void {
    // Check if we have a valid gatewayId
    if (this.gatewayId) {
      // Start auto-refresh of data
      this.dashboardService.startAutoRefresh(this.gatewayId);
    } else {
      // If no gateway ID is provided, we'll use mock data
      console.log('No gateway ID provided, using mock data');
    }
  }

  /**
   * Initialize skeleton groups with mock data structure
   */
  private initializeSkeletonGroups(): void {
    // Add more variety to the skeleton groups
    this.skeletonGroups = [
      {
        unit: 'celsius',
        sensors: [
          { id: 'temp-1', name: 'Temperature Sensor 1', readings: [] },
          { id: 'temp-2', name: 'Temperature Sensor 2', readings: [] },
          { id: 'temp-3', name: 'Temperature Sensor 3', readings: [] }
        ]
      },
      {
        unit: 'percent',
        sensors: [
          { id: 'hum-1', name: 'Humidity Sensor 1', readings: [] },
          { id: 'hum-2', name: 'Humidity Sensor 2', readings: [] },
          { id: 'hum-3', name: 'Humidity Sensor 3', readings: [] }
        ]
      },
      {
        unit: 'volts',
        sensors: [
          { id: 'volt-1', name: 'Battery Monitor 1', readings: [] },
          { id: 'volt-2', name: 'Power Supply', readings: [] },
          { id: 'volt-3', name: 'Solar Panel Output', readings: [] }
        ]
      }
    ];
  }
  
  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Generate mock readings for a sensor
   */
  generateMockReadings(sensorId: string, count: number = 24): Reading[] {
    const readings: Reading[] = [];
    const now = new Date();
    const seed = sensorId.charCodeAt(0) + sensorId.charCodeAt(sensorId.length - 1);
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // hourly data
      
      // Create a somewhat realistic pattern with some randomness
      // Use sine wave with different frequencies for different sensors
      const timeComponent = Math.sin((i + seed) * 0.2) * 5;
      const randomComponent = (Math.random() - 0.5) * 2;
      
      // Base value depends on sensor type
      let baseValue = 20; // default
      if (sensorId.startsWith('temp')) {
        baseValue = 22 + (seed % 3); // temperature around 22-25°C
      } else if (sensorId.startsWith('hum')) {
        baseValue = 45 + (seed % 10); // humidity around 45-55%
      } else if (sensorId.startsWith('volt')) {
        baseValue = 11.5 + (seed % 2); // voltage around 11.5-13.5V
      }
      
      const value = baseValue + timeComponent + randomComponent;
      
      readings.push({
        timestamp: timestamp.toISOString(),
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return readings;
  }

  /**
   * Get mock statistic values based on unit type
   */
  getMockStatValue(unit: string, type: 'avg' | 'min' | 'max'): string {
    const unitSymbol = this.getUnitSymbol(unit);
    
    if (unit === 'celsius') {
      if (type === 'avg') return `22.5${unitSymbol}`;
      if (type === 'min') return `18.2${unitSymbol}`;
      if (type === 'max') return `26.8${unitSymbol}`;
    } else if (unit === 'percent') {
      if (type === 'avg') return `48.3${unitSymbol}`;
      if (type === 'min') return `42.1${unitSymbol}`;
      if (type === 'max') return `56.7${unitSymbol}`;
    } else if (unit === 'volts') {
      if (type === 'avg') return `12.2${unitSymbol}`;
      if (type === 'min') return `11.8${unitSymbol}`;
      if (type === 'max') return `12.9${unitSymbol}`;
    }
    
    return `--${unitSymbol}`;
  }

  /**
   * Get unit symbol for display
   */
  getUnitSymbol(unit: string): string {
    const symbols: { [key: string]: string } = {
      'celsius': '°C',
      'fahrenheit': '°F',
      'percent': '%',
      'ppm': ' ppm',
      'lux': ' lx',
      'meters': 'm',
      'hpa': ' hPa',
      'volts': 'V',
      'amps': 'A',
      'watts': 'W',
      'decibels': ' dB'
    };
    
    return symbols[unit.toLowerCase()] || '';
  }

  /**
   * Calculate average reading value
   */
  getAverageReading(readings: Reading[]): number {
    if (!readings || readings.length === 0) return 0;
    const sum = readings.reduce((total, reading) => total + reading.value, 0);
    return sum / readings.length;
  }

  /**
   * Get minimum reading value
   */
  getMinReading(readings: Reading[]): number {
    if (!readings || readings.length === 0) return 0;
    return Math.min(...readings.map(r => r.value));
  }

  /**
   * Get maximum reading value
   */
  getMaxReading(readings: Reading[]): number {
    if (!readings || readings.length === 0) return 0;
    return Math.max(...readings.map(r => r.value));
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

  /**
   * Get color class for group card based on unit type
   */
  getGroupColorClass(unit: string): string {
    const colorMap: { [key: string]: string } = {
      'celsius': 'card-success',
      'fahrenheit': 'card-success',
      'percent': 'card-info',
      'ppm': 'card-info',
      'lux': 'card-warning',
      'meters': 'card-primary',
      'hpa': 'card-primary',
      'volts': 'card-danger',
      'amps': 'card-danger',
      'watts': 'card-danger',
      'decibels': 'card-warning'
    };
    
    return colorMap[unit.toLowerCase()] || 'card-primary';
  }

  /**
   * Map unit type to sensor chart component's sensorType
   */
  getSensorTypeForChart(unit: string): 'temperature' | 'voltage' | 'humidity' | 'celsius' | 'volts' | 'percent' {
    const typeMap: { [key: string]: 'temperature' | 'voltage' | 'humidity' | 'celsius' | 'volts' | 'percent' } = {
      'celsius': 'celsius',
      'fahrenheit': 'temperature',
      'percent': 'percent',
      'humidity': 'humidity',
      'volts': 'volts',
      'voltage': 'voltage',
      'amps': 'voltage',
      'watts': 'voltage'
    };
    
    return typeMap[unit.toLowerCase()] || 'temperature';
  }
}
