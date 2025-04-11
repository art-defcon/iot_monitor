import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; // Needed for mat-select
import { Observable } from 'rxjs';

import { GatewayService } from '../../services/gateway.service';
import { Gateway } from '../../models/gateway.model';

@Component({
  selector: 'app-compact-gateway-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './compact-gateway-selector.component.html',
  styleUrls: ['./compact-gateway-selector.component.scss']
})
export class CompactGatewaySelectorComponent implements OnInit {
  private gatewayService = inject(GatewayService);

  gateways$: Observable<Gateway[]> | undefined;
  selectedGatewayId: string | null = null; // Or initialize based on service/state

  ngOnInit(): void {
    this.gateways$ = this.gatewayService.getGateways();
    // Optionally, set an initial selection, e.g., the first gateway
    // this.gateways$.pipe(take(1)).subscribe(gateways => {
    //   if (gateways && gateways.length > 0) {
    //     this.selectedGatewayId = gateways[0].id;
    //     this.onGatewaySelected(this.selectedGatewayId);
    //   }
    // });
  }

  onGatewaySelected(gatewayId: string): void {
    this.selectedGatewayId = gatewayId;
    console.log('Selected Gateway ID:', gatewayId);
    // TODO: Implement actual logic when a gateway is selected
    // e.g., update a shared state or emit an event
  }
}
