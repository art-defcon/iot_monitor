import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewayService } from './services/gateway.service';
import { ApiService } from './services/api.service';
import { Gateway } from './models/gateway.model';
import { GatewaySelectorComponent } from './components/gateway-selector/gateway-selector.component';
import { UnitGroupComponent } from './components/unit-group/unit-group.component';
import { DemoDashboardComponent } from './demo-dashboard.component';

// Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSlideToggleModule,
    GatewaySelectorComponent,
    UnitGroupComponent,
    DemoDashboardComponent
  ],
  template: `
    <div class="app-container">
      <header role="banner" class="dashboard-header">
        <div class="header-content">
          <div class="logo-container">
            <mat-icon class="logo-icon">sensors</mat-icon>
            <h1>IoT Monitor</h1>
          </div>
          <div class="header-actions">
            <div class="data-source-toggle">
              <span class="toggle-label">Using {{ apiService.isUsingMockData() ? 'Mock' : 'Live' }} Data</span>
              <mat-slide-toggle 
                [checked]="apiService.isUsingMockData()" 
                (change)="toggleDataSource($event.checked)"
                color="primary">
              </mat-slide-toggle>
            </div>
          </div>
        </div>
      </header>

      <main role="main">
        <div class="main-content">
          <mat-tab-group>
            <mat-tab label="Dashboard">
              <div class="dashboard-container">
                <div class="sidebar" role="navigation">
                  <app-gateway-selector></app-gateway-selector>
                </div>

                <div class="content-area">
                  <!-- Dashboard summary cards -->
                  <div class="dashboard-summary">
                    <div class="summary-card summary-card-primary">
                      <div class="summary-icon">
                        <mat-icon>sensors</mat-icon>
                      </div>
                      <div class="summary-details">
                        <h4>Total Sensors</h4>
                        <div class="summary-value">{{ selectedGateway ? '12' : '—' }}</div>
                      </div>
                    </div>
                    
                    <div class="summary-card summary-card-success">
                      <div class="summary-icon">
                        <mat-icon>check_circle</mat-icon>
                      </div>
                      <div class="summary-details">
                        <h4>Active Sensors</h4>
                        <div class="summary-value">{{ selectedGateway ? '10' : '—' }}</div>
                      </div>
                    </div>
                    
                    <div class="summary-card summary-card-warning">
                      <div class="summary-icon">
                        <mat-icon>warning</mat-icon>
                      </div>
                      <div class="summary-details">
                        <h4>Warnings</h4>
                        <div class="summary-value">{{ selectedGateway ? '2' : '—' }}</div>
                      </div>
                    </div>
                    
                    <div class="summary-card summary-card-danger">
                      <div class="summary-icon">
                        <mat-icon>error</mat-icon>
                      </div>
                      <div class="summary-details">
                        <h4>Alerts</h4>
                        <div class="summary-value">{{ selectedGateway ? '0' : '—' }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Main dashboard content -->
                  <div *ngIf="isLoading" class="loading-container">
                    <div class="loading-content">
                      <div class="skeleton-header"></div>
                      <div class="skeleton-charts">
                        <div class="skeleton-chart" *ngFor="let i of [1,2,3,4,5,6]"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Actual content -->
                  <app-unit-group *ngIf="!isLoading" [gatewayId]="selectedGateway?.id || defaultGatewayId"></app-unit-group>
                </div>
              </div>
            </mat-tab>
            <mat-tab label="Demo">
              <app-demo-dashboard></app-demo-dashboard>
            </mat-tab>
          </mat-tab-group>
        </div>
      </main>

      <footer class="dashboard-footer">
        <div class="footer-content">
          <div class="footer-info">
            <span>IoT Monitor Dashboard</span>
            <span class="separator">|</span>
            <span>Last updated: {{ lastUpdated | date:'medium' }}</span>
          </div>
          <div class="footer-actions">
            <button mat-button color="primary" (click)="refreshData()">
              <mat-icon>refresh</mat-icon> Refresh Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--bg-color);
    }
    
    .dashboard-header {
      background-color: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      box-shadow: var(--shadow-lg);
      z-index: 10;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .logo-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .data-source-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
    }
    
    .main-content {
      flex: 1;
      padding: 1rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }
    
    .dashboard-footer {
      background-color: white;
      border-top: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      margin-top: auto;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }
    
    .footer-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .separator {
      color: var(--border-color);
    }
    
    .footer-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .dashboard-container {
      display: flex;
      gap: var(--spacing-4);
      margin-top: var(--spacing-4);
    }
    
    .sidebar {
      width: 250px;
      flex-shrink: 0;
    }
    
    .content-area {
      flex: 1;
    }
    
    .dashboard-summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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
    
    .summary-card-danger::before {
      background: linear-gradient(60deg, var(--danger-color), #b71c1c);
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
    
    .summary-card-danger .summary-icon {
      background: linear-gradient(60deg, var(--danger-color), #b71c1c);
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
    
    .loading-container {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--spacing-6);
      margin-bottom: var(--spacing-6);
    }
    
    .loading-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }
    
    .skeleton-header {
      height: 24px;
      background: var(--skeleton-color);
      border-radius: var(--radius-md);
      width: 60%;
      animation: pulse 1.5s infinite;
    }
    
    .skeleton-charts {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
    }
    
    .skeleton-chart {
      height: 200px;
      background: var(--skeleton-color);
      border-radius: var(--radius-md);
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% {
        opacity: 0.6;
      }
      50% {
        opacity: 0.8;
      }
      100% {
        opacity: 0.6;
      }
    }
    
    @media (max-width: 1200px) {
      .dashboard-summary {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .skeleton-charts {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
      }
      
      .dashboard-summary {
        grid-template-columns: 1fr;
      }
      
      .skeleton-charts {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  selectedGateway: Gateway | null = null;
  isLoading: boolean = true;
  lastUpdated: Date = new Date();
  defaultGatewayId: string = '81380b79-d725-4e80-baa7-0fe82cf0993e'; // Match the first gateway ID from mock data

  constructor(
    public gatewayService: GatewayService,
    public apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Subscribe to gateway selection changes
    this.gatewayService.selectedGateway$.subscribe(gateway => {
      this.selectedGateway = gateway;
      this.isLoading = true;
      
      // Simulate loading delay
      setTimeout(() => {
        this.isLoading = false;
      }, 1200);
    });

    // Initialize with default gateway if none is selected
    if (!this.selectedGateway) {
      this.loadDefaultData();
    }
    
    // Force loading to complete after a delay
    setTimeout(() => {
      console.log('Forcing loading to complete');
      this.isLoading = false;
    }, 3000);
  }

  toggleDataSource(useMock: boolean): void {
    this.apiService.toggleMockData(useMock);
    this.refreshData();
  }

  refreshData(): void {
    this.isLoading = true;
    this.gatewayService.fetchGateways();
    
    // Simulate loading delay
    setTimeout(() => {
      this.isLoading = false;
      this.lastUpdated = new Date();
      this.snackBar.open('Dashboard refreshed', 'Close', { duration: 2000 });
    }, 1200);
  }

  private loadDefaultData(): void {
    // If no gateway is selected, we'll use a default one for the skeleton UI
    this.defaultGatewayId = '81380b79-d725-4e80-baa7-0fe82cf0993e'; // Match the first gateway ID from mock data
    this.isLoading = true;
    
    // Simulate loading delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1200);
  }
}
