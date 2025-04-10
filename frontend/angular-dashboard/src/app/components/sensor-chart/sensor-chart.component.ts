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
  @Input() sensorType: 'temperature' | 'voltage' | 'humidity' | 'celsius' | 'volts' | 'percent' = 'temperature';
  
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
          color: 'rgba(0, 0, 0, 0.04)',
          lineWidth: 0.5
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 8
          },
          color: '#94a3b8', // lighter text color
          padding: 4,
          maxTicksLimit: 4
        },
      },
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 8
          },
          color: '#94a3b8', // lighter text color
          padding: 4,
          maxTicksLimit: 3
        },
      }
    },
    elements: {
      line: {
        tension: 0.4, // More curved lines
        borderWidth: 2,
        fill: 'start',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 160);
          
          // Different colors based on sensor type
          if (this.sensorType === 'temperature' || this.sensorType === 'celsius') {
            gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
            gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
            return gradient;
          } else if (this.sensorType === 'humidity' || this.sensorType === 'percent') {
            gradient.addColorStop(0, 'rgba(3, 169, 244, 0.3)');
            gradient.addColorStop(1, 'rgba(3, 169, 244, 0)');
            return gradient;
          } else if (this.sensorType === 'voltage' || this.sensorType === 'volts') {
            gradient.addColorStop(0, 'rgba(244, 67, 54, 0.3)');
            gradient.addColorStop(1, 'rgba(244, 67, 54, 0)');
            return gradient;
          } else {
            gradient.addColorStop(0, 'rgba(58, 134, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(58, 134, 255, 0)');
            return gradient;
          }
        },
        borderColor: (context) => {
          // Different colors based on sensor type
          if (this.sensorType === 'temperature' || this.sensorType === 'celsius') {
            return '#4caf50'; // success-color
          } else if (this.sensorType === 'humidity' || this.sensorType === 'percent') {
            return '#03a9f4'; // info-color
          } else if (this.sensorType === 'voltage' || this.sensorType === 'volts') {
            return '#f44336'; // danger-color
          } else {
            return '#3a86ff'; // primary-color
          }
        }
      },
      point: {
        radius: 0, // Hide points by default for cleaner look
        hoverRadius: 4,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: (context) => {
          // Different colors based on sensor type
          if (this.sensorType === 'temperature' || this.sensorType === 'celsius') {
            return '#4caf50'; // success-color
          } else if (this.sensorType === 'humidity' || this.sensorType === 'percent') {
            return '#03a9f4'; // info-color
          } else if (this.sensorType === 'voltage' || this.sensorType === 'volts') {
            return '#f44336'; // danger-color
          } else {
            return '#3a86ff'; // primary-color
          }
        },
        hitRadius: 8
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
          size: 10,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 10
        },
        padding: 8,
        borderColor: '#e2e8f0', // border-color
        borderWidth: 1,
        cornerRadius: 6,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            switch (this.sensorType) {
              case 'temperature':
              case 'celsius':
                return `Temperature: ${value.toFixed(1)}°C`;
              case 'voltage':
              case 'volts':
                return `Voltage: ${value.toFixed(1)}V`;
              case 'humidity':
              case 'percent':
                return `Humidity: ${value.toFixed(1)}%`;
              default:
                return `Value: ${value.toFixed(1)}`;
            }
          }
        }
      }
    },
    animation: {
      duration: 500
    },
    hover: {
      mode: 'nearest',
      intersect: false
    },
    layout: {
      padding: {
        left: 2,
        right: 2,
        top: 5,
        bottom: 0
      }
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
    
    // Determine colors based on sensor type
    let borderColor = '#3a86ff'; // Default blue
    let backgroundColor = 'rgba(58, 134, 255, 0.1)';
    
    if (this.sensorType === 'temperature' || this.sensorType === 'celsius') {
      borderColor = '#4caf50'; // Green
      backgroundColor = 'rgba(76, 175, 80, 0.1)';
    } else if (this.sensorType === 'humidity' || this.sensorType === 'percent') {
      borderColor = '#03a9f4'; // Light blue
      backgroundColor = 'rgba(3, 169, 244, 0.1)';
    } else if (this.sensorType === 'voltage' || this.sensorType === 'volts') {
      borderColor = '#f44336'; // Red
      backgroundColor = 'rgba(244, 67, 54, 0.1)';
    }
    
    // Update chart data with simpler configuration
    this.chartData = {
      labels: timestamps,
      datasets: [
        {
          data: values,
          label: this.getLabelForSensorType(),
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: borderColor,
          pointHoverBackgroundColor: borderColor,
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
