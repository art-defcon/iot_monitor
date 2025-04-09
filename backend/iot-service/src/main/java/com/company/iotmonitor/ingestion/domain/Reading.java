package com.company.iotmonitor.ingestion.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "readings")
@Data
public class Reading {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String readingId;

    @ManyToOne
    @JoinColumn(name = "gateway_id", nullable = false)
    private Gateway gateway;

    @Column(nullable = false)
    private Instant timestamp;

    @Column(nullable = false, length = 100)
    private String sensorLabel;

    @Column(nullable = false, length = 10)
    private String unit;

    @Column(nullable = false)
    private Double readingValue;

    public Reading() {}

    public Reading(String readingId, Gateway gateway, Instant timestamp, 
                  String sensorLabel, String unit, Double readingValue) {
        this.readingId = readingId;
        this.gateway = gateway;
        this.timestamp = timestamp;
        this.sensorLabel = sensorLabel;
        this.unit = unit;
        this.readingValue = readingValue;
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }
}
