import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule
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
            <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
            <a mat-button routerLink="/demo" routerLinkActive="active">Demo</a>
          </div>
        </div>
      </header>

      <main role="main">
        <div class="main-content">
          <!-- Router outlet for the content -->
          <router-outlet></router-outlet>
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
    
    a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: bold;
    }
  `]
})
export class AppLayoutComponent {
  lastUpdated: Date = new Date();

  constructor(public apiService: ApiService) {}

  toggleDataSource(useMock: boolean): void {
    this.apiService.toggleMockData(useMock);
    this.refreshData();
  }

  refreshData(): void {
    this.lastUpdated = new Date();
  }
}
