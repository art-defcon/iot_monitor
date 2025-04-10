import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sensor-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorChartComponent implements OnChanges, AfterViewInit {
  @Input() readings: any[] = [];
  @Input() sensorType: 'temperature' | 'voltage' | 'humidity' | 'celsius' | 'volts' | 'percent' = 'temperature';
  @Input() sensorName: string = 'Sensor';

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
          color: 'rgba(255, 255, 255, 0.1)', // Subtle white grid lines
          lineWidth: 0.5
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            family: 'Roboto, "Helvetica Neue", sans-serif',
            size: 9
          },
          color: 'rgba(255, 255, 255, 0.8)', // Brighter white ticks
          padding: 5,
          maxTicksLimit: 5
        },
      },
      x: {
        grid: {
          display: false // Hide x-axis grid lines for cleaner look
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            family: 'Roboto, "Helvetica Neue", sans-serif',
            size: 9
          },
          color: 'rgba(255, 255, 255, 0.8)', // Brighter white ticks
          padding: 5,
          maxTicksLimit: 4
        },
      }
    },
    elements: {
      line: {
        tension: 0.4, // Smooth curves
        borderWidth: 3, // Slightly thicker line
        fill: false,
        borderColor: '#FFFFFF' // White line color
      },
      point: {
        radius: 0, // Hide points by default
        hoverRadius: 4,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        hitRadius: 10
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        titleFont: {
          family: 'Roboto, "Helvetica Neue", sans-serif',
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Roboto, "Helvetica Neue", sans-serif',
          size: 11
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            return `${this.sensorName}: ${value.toFixed(1)}${this.getUnitSymbol()}`;
          }
        }
      }
    },
    animation: {
      duration: 300
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 10,
        bottom: 0
      }
    }
  };
  
  chartType: ChartType = 'line';
  lastUpdated: string | null = null;
  isLoading: boolean = true;
  currentValue: number | null = null;
  trendDirection: 'up' | 'down' | 'none' = 'none';
  previousValue: number | null = null;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // No additional initialization needed
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['readings'] || changes['sensorType']) {
      this.processReadings();
    }
    if (changes['sensorName']) {
      this.cdr.markForCheck();
    }
  }

  private processReadings(): void {
    this.isLoading = true;

    if (!this.readings || this.readings.length === 0) {
      this.chartData = {
        datasets: [],
        labels: []
      };
      this.currentValue = null;
      this.previousValue = null;
      this.trendDirection = 'none';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    // Sort readings by timestamp (ensure latest is last)
    const sortedReadings = [...this.readings].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Get the latest reading for current value display
    const latestReading = sortedReadings[sortedReadings.length - 1];
    
    // Store previous value for trend calculation
    if (sortedReadings.length > 1) {
      this.previousValue = sortedReadings[sortedReadings.length - 2].value;
    } else {
      this.previousValue = null;
    }
    
    this.currentValue = latestReading ? latestReading.value : null;
    
    // Calculate trend direction
    this.calculateTrend();

    // Extract timestamps and values
    const timestamps = sortedReadings.map(r => {
      const date = new Date(r.timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    });

    const values = sortedReadings.map(r => r.value);

    // Update chart data
    this.chartData = {
      labels: timestamps,
      datasets: [
        {
          data: values,
          label: this.sensorName,
          borderColor: '#FFFFFF', // White line
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: 'rgba(255, 255, 255, 0.8)',
          fill: false
        }
      ]
    };

    this.updateLastUpdated(latestReading?.timestamp);
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  // Calculate trend direction based on current and previous values
  private calculateTrend(): void {
    if (this.currentValue === null || this.previousValue === null) {
      this.trendDirection = 'none';
      return;
    }
    
    const difference = this.currentValue - this.previousValue;
    
    // Add a small threshold to avoid showing trends for tiny fluctuations
    const threshold = 0.1;
    
    if (difference > threshold) {
      this.trendDirection = 'up';
    } else if (difference < -threshold) {
      this.trendDirection = 'down';
    } else {
      this.trendDirection = 'none';
    }
  }

  // Helper to get the unit symbol
  getUnitSymbol(): string {
    switch (this.sensorType) {
      case 'temperature':
      case 'celsius':
        return '°C';
      case 'voltage':
      case 'volts':
        return 'V';
      case 'humidity':
      case 'percent':
        return '%';
      default:
        return '';
    }
  }

  // Helper to format the current value
  getFormattedCurrentValue(): string {
    if (this.currentValue === null || this.currentValue === undefined) {
      return 'N/A';
    }
    return `${this.currentValue.toFixed(1)}${this.getUnitSymbol()}`;
  }

  // Format relative time (e.g., "5 minutes ago")
  getRelativeTime(): string {
    if (!this.lastUpdated) {
      return 'never';
    }
    
    const now = new Date();
    const updated = new Date(this.lastUpdated);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffMins < 120) {
      return '1 hour ago';
    } else {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hours ago`;
    }
  }

  private updateLastUpdated(latestTimestamp?: string): void {
    const timestamp = latestTimestamp ? new Date(latestTimestamp) : new Date();
    this.lastUpdated = timestamp.toISOString();
  }

  // Helper to get icon based on sensor type
  getMetricIcon(): string {
    switch (this.sensorType) {
      case 'temperature':
      case 'celsius':
        return 'thermostat';
      case 'voltage':
      case 'volts':
        return 'flash_on';
      case 'humidity':
      case 'percent':
        return 'water_drop';
      default:
        return 'help_outline';
    }
  }
}
