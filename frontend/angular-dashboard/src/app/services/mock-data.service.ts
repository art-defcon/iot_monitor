import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Gateway } from '../models/gateway.model';
import { GatewayReading } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockGateways: Gateway[] = [
    {
      id: '81380b79-d725-4e80-baa7-0fe82cf0993e',
      name: 'Production Gateway',
      location: 'Building A, Floor 3',
      model: 'IoT-GW-Pro-2023',
      status: 'ACTIVE',
      registeredAt: new Date(2023, 1, 15).toISOString()
    },
    {
      id: '8366bd13-3332-4869-8459-e3761a3543fe',
      name: 'Testing Gateway',
      location: 'Lab Room 101',
      model: 'IoT-GW-Test',
      status: 'ACTIVE',
      registeredAt: new Date(2023, 3, 22).toISOString()
    },
    {
      id: '7255bd13-4442-4869-9559-e3761a3543fe',
      name: 'Outdoor Sensors',
      location: 'Parking Lot',
      model: 'IoT-GW-Outdoor',
      status: 'WARNING',
      registeredAt: new Date(2023, 5, 10).toISOString()
    }
  ];

  constructor() { }

  getGateways(): Observable<Gateway[]> {
    return of(this.mockGateways).pipe(delay(800));
  }

  getGateway(id: string): Observable<Gateway> {
    const gateway = this.mockGateways.find(g => g.id === id) || this.mockGateways[0];
    return of(gateway).pipe(delay(500));
  }

  getReadings(gatewayId: string, start: string, end: string): Observable<GatewayReading[]> {
    // Generate mock readings based on the gateway ID
    const readings = this.generateMockReadings(gatewayId);
    return of(readings).pipe(delay(1200));
  }

  private generateMockReadings(gatewayId: string): GatewayReading[] {
    const readings: GatewayReading[] = [];
    const now = new Date();
    
    // Temperature sensors
    const tempSensors = ['Temperature Sensor 1', 'Temperature Sensor 2', 'Temperature Sensor 3'];
    tempSensors.forEach((sensor, idx) => {
      readings.push(...this.generateSensorReadings(
        gatewayId, 
        sensor, 
        'celsius', 
        20 + Math.random() * 5, // Base value between 20-25
        0.5 + Math.random(), // Fluctuation between 0.5-1.5
        now,
        idx
      ));
    });
    
    // Humidity sensors
    const humiditySensors = ['Humidity Sensor 1', 'Humidity Sensor 2'];
    humiditySensors.forEach((sensor, idx) => {
      readings.push(...this.generateSensorReadings(
        gatewayId, 
        sensor, 
        'percent', 
        40 + Math.random() * 20, // Base value between 40-60
        2 + Math.random() * 3, // Fluctuation between 2-5
        now,
        idx
      ));
    });
    
    // Voltage sensors
    const voltageSensors = ['Voltage Sensor 1', 'Battery Monitor 1', 'Power Supply'];
    voltageSensors.forEach((sensor, idx) => {
      readings.push(...this.generateSensorReadings(
        gatewayId, 
        sensor, 
        'volts', 
        11.5 + Math.random() * 1, // Base value between 11.5-12.5
        0.2 + Math.random() * 0.3, // Fluctuation between 0.2-0.5
        now,
        idx
      ));
    });
    
    // Pressure sensors
    const pressureSensors = ['Pressure Sensor 1', 'Barometer 1'];
    pressureSensors.forEach((sensor, idx) => {
      readings.push(...this.generateSensorReadings(
        gatewayId, 
        sensor, 
        'hpa', 
        1010 + Math.random() * 10, // Base value between 1010-1020
        2 + Math.random() * 2, // Fluctuation between 2-4
        now,
        idx
      ));
    });
    
    return readings;
  }

  private generateSensorReadings(
    gatewayId: string, 
    sensorLabel: string, 
    unit: string, 
    baseValue: number, 
    fluctuation: number,
    now: Date,
    seedOffset: number = 0
  ): GatewayReading[] {
    const readings: GatewayReading[] = [];
    const hours = 24; // Generate 24 hours of data
    const interval = 60; // Minutes between readings
    
    // Use seedOffset to ensure different sensors have different patterns
    const seed = seedOffset * 100;
    
    for (let i = 0; i < hours * (60 / interval); i++) {
      const timestamp = new Date(now.getTime() - (i * interval * 60 * 1000));
      
      // Create a somewhat realistic pattern with some randomness
      // Use sine wave with different frequencies for different sensors
      const timeComponent = Math.sin((i + seed) * 0.2) * fluctuation;
      const randomComponent = (Math.random() - 0.5) * fluctuation * 0.5;
      const value = baseValue + timeComponent + randomComponent;
      
      readings.push({
        readingId: `mock-${gatewayId}-${sensorLabel}-${i}`,
        timestamp: timestamp.toISOString(),
        sensorLabel: sensorLabel,
        unit: unit,
        readingValue: parseFloat(value.toFixed(2))
      });
    }
    
    return readings;
  }
}
