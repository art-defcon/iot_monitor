import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewayService } from './services/gateway.service';
import { Gateway } from './models/gateway.model';
import { GatewaySelectorComponent } from './components/gateway-selector/gateway-selector.component';
import { UnitGroupComponent } from './components/unit-group/unit-group.component';

// Material imports
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    GatewaySelectorComponent,
    UnitGroupComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedGateway: Gateway | null = null;
  isLoading: boolean = true;

  constructor(private gatewayService: GatewayService) {
    this.gatewayService.selectedGateway$.subscribe(gateway => {
      this.selectedGateway = gateway;
      // Simulate loading delay (replace with actual data loading)
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    });
  }
}
