import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GatewayService } from '../../services/gateway.service';
import { Gateway } from '../../models/gateway.model';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-gateway-selector',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './gateway-selector.component.html',
  styleUrls: ['./gateway-selector.component.scss']
})
export class GatewaySelectorComponent implements OnInit {
  gateways: Gateway[] = [];
  selectedGateway: Gateway | null = null;
  isLoading = false;

  constructor(
    private gatewayService: GatewayService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.gatewayService.selectedGateway$.subscribe(gateway => {
      this.selectedGateway = gateway;
    });
    
    this.loadGateways();
  }

  loadGateways(): void {
    this.isLoading = true;
    
    this.gatewayService.fetchGateways();
    this.gatewayService.getGateways().subscribe({
      next: (gateways) => {
        this.gateways = gateways;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading gateways:', err);
        this.isLoading = false;
        this.loadMockGateways();
        this.snackBar.open('Failed to load gateways. Using mock data.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  onGatewayChange(gateway: Gateway): void {
    if (!gateway) return;
    
    this.selectedGateway = gateway;
    this.gatewayService.setSelectedGateway(gateway);
  }

  deleteGateway(): void {
    if (!this.selectedGateway) return;

    if (confirm(`Are you sure you want to delete gateway "${this.selectedGateway.name}"? This will also delete all readings associated with this gateway.`)) {
      this.isLoading = true;
      const gatewayId = this.selectedGateway.id;
      
      this.gatewayService.deleteGateway(gatewayId).subscribe({
        next: () => {
          this.snackBar.open(`Gateway "${this.selectedGateway?.name}" deleted successfully`, 'Close', {
            duration: 3000
          });
          this.loadGateways();
        },
        error: (err) => {
          console.error('Error deleting gateway:', err);
          this.snackBar.open(`Error deleting gateway: ${err.message}`, 'Close', {
            duration: 5000
          });
          this.isLoading = false;
        }
      });
    }
  }
  
  private loadMockGateways(): void {
    this.gateways = [
      {
        id: '81380b79-d725-4e80-baa7-0fe82cf0993e',
        name: 'Test Gateway',
        location: '59.329323, 18.068581',
        model: 'TestModel-GW1',
        status: 'ACTIVE',
        registeredAt: new Date().toISOString()
      },
      {
        id: '8366bd13-3332-4869-8459-e3761a3543fe',
        name: 'Battery 1',
        location: '59.329323, 18.068581',
        model: null,
        status: 'ACTIVE',
        registeredAt: new Date().toISOString()
      }
    ];
    
    if (this.gateways.length > 0 && !this.selectedGateway) {
      this.onGatewayChange(this.gateways[0]);
    }
  }
}
