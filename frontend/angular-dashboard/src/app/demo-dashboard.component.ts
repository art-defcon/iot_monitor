import { Component } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SensorChartComponent } from './components/sensor-chart/sensor-chart.component';

interface Reading {
  timestamp: string;
  value: number;
}

@Component({
  selector: 'app-demo-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    MatIconModule,
    SensorChartComponent
  ],
  template: `
    <div class="demo-container">
      <h1>IoT Monitor Demo Dashboard</h1>
      
      <div class="dashboard-summary">
        <div class="summary-card summary-card-primary">
          <div class="summary-icon">
            <mat-icon>sensors</mat-icon>
          </div>
          <div class="summary-details">
            <h4>Total Sensors</h4>
            <div class="summary-value">9</div>
          </div>
        </div>
        
        <div class="summary-card summary-card-success">
          <div class="summary-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="summary-details">
            <h4>Active Sensors</h4>
            <div class="summary-value">9</div>
          </div>
        </div>
        
        <div class="summary-card summary-card-warning">
          <div class="summary-icon">
            <mat-icon>warning</mat-icon>
          </div>
          <div class="summary-details">
            <h4>Warnings</h4>
            <div class="summary-value">0</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-groups">
        <div class="sensor-group-card card-success">
          <div class="group-header">
            <div class="group-title">
              <span class="unit-icon">
                <mat-icon>thermostat</mat-icon>
              </span>
              <h3>Temperature Measurements</h3>
            </div>
            <div class="group-info">
              <span>3 sensors</span>
              <span class="mock-data-badge">Demo Data</span>
            </div>
          </div>
          
          <div class="group-description">
            <p>Temperature measurements in degrees Celsius (°C)</p>
          </div>

          <div class="dashboard-cards">
            <div *ngFor="let sensor of temperatureSensors" class="sensor-card">
              <div class="sensor-header">
                <h4>{{ sensor.name }}</h4>
                <span class="sensor-status status-active"></span>
              </div>
              
              <app-sensor-chart 
                [readings]="sensor.readings" 
                [sensorType]="'celsius'">
              </app-sensor-chart>
              
              <div class="sensor-stats">
                <div class="stat">
                  <span class="stat-label">Avg</span>
                  <span class="stat-value">{{ getAverage(sensor.readings) | number:'1.1-1' }}°C</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Min</span>
                  <span class="stat-value">{{ getMin(sensor.readings) | number:'1.1-1' }}°C</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Max</span>
                  <span class="stat-value">{{ getMax(sensor.readings) | number:'1.1-1' }}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sensor-group-card card-info">
          <div class="group-header">
            <div class="group-title">
              <span class="unit-icon">
                <mat-icon>water_drop</mat-icon>
              </span>
              <h3>Humidity Measurements</h3>
            </div>
            <div class="group-info">
              <span>3 sensors</span>
              <span class="mock-data-badge">Demo Data</span>
            </div>
          </div>
          
          <div class="group-description">
            <p>Relative measurements shown as percentages (%)</p>
          </div>

          <div class="dashboard-cards">
            <div *ngFor="let sensor of humiditySensors" class="sensor-card">
              <div class="sensor-header">
                <h4>{{ sensor.name }}</h4>
                <span class="sensor-status status-active"></span>
              </div>
              
              <app-sensor-chart 
                [readings]="sensor.readings" 
                [sensorType]="'percent'">
              </app-sensor-chart>
              
              <div class="sensor-stats">
                <div class="stat">
                  <span class="stat-label">Avg</span>
                  <span class="stat-value">{{ getAverage(sensor.readings) | number:'1.1-1' }}%</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Min</span>
                  <span class="stat-value">{{ getMin(sensor.readings) | number:'1.1-1' }}%</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Max</span>
                  <span class="stat-value">{{ getMax(sensor.readings) | number:'1.1-1' }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sensor-group-card card-danger">
          <div class="group-header">
            <div class="group-title">
              <span class="unit-icon">
                <mat-icon>electric_bolt</mat-icon>
              </span>
              <h3>Voltage Measurements</h3>
            </div>
            <div class="group-info">
              <span>3 sensors</span>
              <span class="mock-data-badge">Demo Data</span>
            </div>
          </div>
          
          <div class="group-description">
            <p>Voltage measurements in volts (V)</p>
          </div>

          <div class="dashboard-cards">
            <div *ngFor="let sensor of voltageSensors" class="sensor-card">
              <div class="sensor-header">
                <h4>{{ sensor.name }}</h4>
                <span class="sensor-status status-active"></span>
              </div>
              
              <app-sensor-chart 
                [readings]="sensor.readings" 
                [sensorType]="'volts'">
              </app-sensor-chart>
              
              <div class="sensor-stats">
                <div class="stat">
                  <span class="stat-label">Avg</span>
                  <span class="stat-value">{{ getAverage(sensor.readings) | number:'1.1-1' }}V</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Min</span>
                  <span class="stat-value">{{ getMin(sensor.readings) | number:'1.1-1' }}V</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Max</span>
                  <span class="stat-value">{{ getMax(sensor.readings) | number:'1.1-1' }}V</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    h1 {
      margin-bottom: 20px;
      color: var(--primary-color);
    }
    
    .dashboard-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }
    
    .summary-card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--spacing-4);
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      position: relative;
      overflow: hidden;
    }
    
    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
    }
    
    .summary-card-primary::before {
      background: linear-gradient(60deg, var(--primary-color), var(--primary-dark));
    }
    
    .summary-card-success::before {
      background: linear-gradient(60deg, var(--success-color), #2e7d32);
    }
    
    .summary-card-warning::before {
      background: linear-gradient(60deg, var(--warning-color), #e65100);
    }
    
    .summary-icon {
      background: linear-gradient(60deg, var(--primary-color), var(--primary-dark));
      color: white;
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
    }
    
    .summary-card-success .summary-icon {
      background: linear-gradient(60deg, var(--success-color), #2e7d32);
    }
    
    .summary-card-warning .summary-icon {
      background: linear-gradient(60deg, var(--warning-color), #e65100);
    }
    
    .summary-details h4 {
      margin: 0 0 var(--spacing-1);
      font-size: var(--font-size-md);
      color: var(--text-secondary);
      font-weight: var(--font-weight-medium);
    }
    
    .summary-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }
    
    .dashboard-groups {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }
    
    .sensor-group-card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    
    .card-primary .group-header {
      background: linear-gradient(60deg, var(--primary-color), var(--primary-dark));
    }
    
    .card-success .group-header {
      background: linear-gradient(60deg, var(--success-color), #2e7d32);
    }
    
    .card-info .group-header {
      background: linear-gradient(60deg, var(--info-color), #0277bd);
    }
    
    .card-danger .group-header {
      background: linear-gradient(60deg, var(--danger-color), #b71c1c);
    }
    
    .group-header {
      color: white;
      padding: var(--spacing-3) var(--spacing-6);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .group-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }
    
    .unit-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .group-title h3 {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-medium);
    }
    
    .group-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      font-size: var(--font-size-md);
      opacity: 0.9;
    }
    
    .mock-data-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }
    
    .group-description {
      padding: var(--spacing-3) var(--spacing-6);
      border-bottom: 1px solid var(--border-color);
    }
    
    .group-description p {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
      padding: var(--spacing-4) var(--spacing-6) var(--spacing-6);
    }
    
    .sensor-card {
      background: var(--card-bg);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-3);
      border: 1px solid var(--border-color);
      transition: all var(--transition-normal);
    }
    
    .sensor-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-light);
    }
    
    .sensor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-2);
      padding-bottom: var(--spacing-1);
      border-bottom: 1px solid var(--border-color);
    }
    
    .sensor-header h4 {
      margin: 0;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 85%;
    }
    
    .sensor-status {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .status-active {
      background-color: var(--success-color);
      box-shadow: 0 0 0 2px rgba(var(--success-color-rgb), 0.2);
    }
    
    .sensor-stats {
      display: flex;
      justify-content: space-between;
      padding-top: var(--spacing-2);
      border-top: 1px solid var(--border-color);
      margin-top: var(--spacing-2);
    }
    
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin-bottom: 2px;
    }
    
    .stat-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }
    
    @media (max-width: 1200px) {
      .dashboard-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-summary {
        grid-template-columns: 1fr;
      }
      
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DemoDashboardComponent {
  temperatureSensors = [
    {
      name: 'Temperature Sensor 1',
      readings: this.generateMockReadings(22, 3, 24)
    },
    {
      name: 'Temperature Sensor 2',
      readings: this.generateMockReadings(23, 2, 24)
    },
    {
      name: 'Temperature Sensor 3',
      readings: this.generateMockReadings(21, 4, 24)
    }
  ];
  
  humiditySensors = [
    {
      name: 'Humidity Sensor 1',
      readings: this.generateMockReadings(45, 10, 24)
    },
    {
      name: 'Humidity Sensor 2',
      readings: this.generateMockReadings(50, 8, 24)
    },
    {
      name: 'Humidity Sensor 3',
      readings: this.generateMockReadings(48, 12, 24)
    }
  ];
  
  voltageSensors = [
    {
      name: 'Battery Monitor 1',
      readings: this.generateMockReadings(12, 0.5, 24)
    },
    {
      name: 'Power Supply',
      readings: this.generateMockReadings(11.5, 0.3, 24)
    },
    {
      name: 'Solar Panel Output',
      readings: this.generateMockReadings(13, 1, 24)
    }
  ];
  
  generateMockReadings(baseValue: number, fluctuation: number, count: number): Reading[] {
    const readings: Reading[] = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // hourly data
      
      // Create a somewhat realistic pattern with some randomness
      const timeComponent = Math.sin(i * 0.2) * fluctuation;
      const randomComponent = (Math.random() - 0.5) * fluctuation * 0.5;
      const value = baseValue + timeComponent + randomComponent;
      
      readings.push({
        timestamp: timestamp.toISOString(),
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return readings.reverse(); // Reverse to get chronological order
  }
  
  getAverage(readings: Reading[]): number {
    if (!readings || readings.length === 0) return 0;
    const sum = readings.reduce((total, reading) => total + reading.value, 0);
    return sum / readings.length;
  }
  
  getMin(readings: Reading[]): number {
    if (!readings || readings.length === 0) return 0;
    return Math.min(...readings.map(r => r.value));
  }
  
  getMax(readings: Reading[]): number {
    if (!readings || readings.length === 0) return 0;
    return Math.max(...readings.map(r => r.value));
  }
}
