import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sensor-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatProgressSpinnerModule],
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.scss']
})
export class SensorChartComponent implements OnChanges, AfterViewInit {
  @Input() readings: any[] = []; 
  @Input() sensorType: 'temperature' | 'voltage' | 'humidity' = 'temperature';
  
  chartData: ChartData = { 
    datasets: [],
    labels: []
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 10
          },
          color: '#64748b', // text-secondary
          padding: 8
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 10
          },
          color: '#64748b', // text-secondary
          padding: 8,
          maxTicksLimit: 6
        }
      }
    },
    elements: {
      line: {
        tension: 0.3, // Slightly curved lines
        borderWidth: 2,
        fill: 'start',
        backgroundColor: 'rgba(58, 134, 255, 0.1)', // primary-color with opacity
        borderColor: '#3a86ff', // primary-color
      },
      point: {
        radius: 3,
        hoverRadius: 5,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#3a86ff', // primary-color
        hitRadius: 10
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#ffffff',
        titleColor: '#1e293b', // text-primary
        bodyColor: '#64748b', // text-secondary
        titleFont: {
          family: 'Inter, sans-serif',
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 12
        },
        padding: 12,
        borderColor: '#e2e8f0', // border-color
        borderWidth: 1,
        cornerRadius: 6,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            switch (this.sensorType) {
              case 'temperature':
                return `Temperature: ${value.toFixed(1)}°C`;
              case 'voltage':
                return `Voltage: ${value.toFixed(1)}V`;
              case 'humidity':
                return `Humidity: ${value.toFixed(1)}%`;
              default:
                return `Value: ${value.toFixed(1)}`;
            }
          }
        }
      }
    },
    animation: {
      duration: 750
    },
    hover: {
      mode: 'nearest',
      intersect: false
    }
  };
  chartType: ChartType = 'line';
  lastUpdated: string | null = null;
  isLoading: boolean = true;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Apply CSS variables to chart
    if (this.chartOptions && this.chartOptions.elements && this.chartOptions.elements.line) {
      this.chartOptions.elements.line.borderColor = 'var(--primary-color)';
      this.chartOptions.elements.line.backgroundColor = 'rgba(var(--primary-color-rgb), 0.1)';
      
      if (this.chartOptions.elements.point) {
        this.chartOptions.elements.point.borderColor = 'var(--primary-color)';
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['readings'] || changes['sensorType']) {
      this.processReadings();
    }
  }

  private processReadings(): void {
    this.isLoading = true;
    
    if (!this.readings || this.readings.length === 0) {
      this.chartData = { 
        datasets: [],
        labels: []
      };
      this.isLoading = false;
      return;
    }

    // Sort readings by timestamp
    const sortedReadings = [...this.readings].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Extract timestamps and values
    const timestamps = sortedReadings.map(r => {
      const date = new Date(r.timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    
    const values = sortedReadings.map(r => r.value);
    
    // Create gradient
    const canvas = this.elementRef.nativeElement.querySelector('canvas');
    let gradient;
    
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(58, 134, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(58, 134, 255, 0)');
      }
    }
    
    // Update chart data
    this.chartData = {
      labels: timestamps,
      datasets: [
        {
          data: values,
          label: this.getLabelForSensorType(),
          borderColor: '#3a86ff',
          backgroundColor: gradient || 'rgba(58, 134, 255, 0.1)',
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#3a86ff',
          pointHoverBackgroundColor: '#3a86ff',
          pointHoverBorderColor: '#ffffff',
          fill: true
        }
      ]
    };
    
    this.updateLastUpdated();
    this.isLoading = false;
  }

  private getLabelForSensorType(): string {
    switch (this.sensorType) {
      case 'temperature':
        return 'Temperature (°C)';
      case 'voltage':
        return 'Voltage (V)';
      case 'humidity':
        return 'Humidity (%)';
      default:
        return 'Value';
    }
  }

  private updateLastUpdated(): void {
    const now = new Date();
    this.lastUpdated = now.toISOString();
  }
}
