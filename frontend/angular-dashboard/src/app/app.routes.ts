import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DemoDashboardComponent } from './demo-dashboard.component';
import { AppLayoutComponent } from './app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: AppComponent },
      { path: 'demo', component: DemoDashboardComponent }
    ]
  }
];
