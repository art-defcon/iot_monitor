package com.company.iotmonitor.ingestion.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Data
public class DeviceReading {
    public enum SensorType {
        VOLTAGE, TEMPERATURE, HUMIDITY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String deviceReadingId;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(nullable = false)
    private Instant timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SensorType sensorType;

    @Column(nullable = false, length = 10)
    private String unit;

    @Column(nullable = false)
    private Double readingValue;

    public DeviceReading() {}

    public DeviceReading(String deviceReadingId, Device device, Instant timestamp, 
                        SensorType sensorType, String unit, Double readingValue) {
        this.deviceReadingId = deviceReadingId;
        this.device = device;
        this.timestamp = timestamp;
        this.sensorType = sensorType;
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
