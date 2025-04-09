package com.company.iotmonitor.ingestion.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "gateways")
@Data
public class Gateway {
    @Id
    private UUID gatewayId;
    
    @Column(unique = true)
    private String name;
    private String location;
    private String model;
    private String status = "ACTIVE";
    
    @Column(updatable = false)
    private Instant registeredAt = Instant.now();

    @PrePersist
    protected void onCreate() {
        if (gatewayId == null) {
            gatewayId = UUID.randomUUID();
        }
        if (registeredAt == null) {
            registeredAt = Instant.now();
        }
    }
}
