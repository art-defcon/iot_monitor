package com.company.iotmonitor.ingestion.service;

import com.company.iotmonitor.ingestion.domain.DeviceReading;
import com.company.iotmonitor.ingestion.repository.DeviceRepository;
import org.springframework.stereotype.Component;
import java.time.Instant;

@Component
public class ValidationUtils {
    private final DeviceRepository deviceRepository;

    public ValidationUtils(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public void validateGatewayRegistration(String name, String location, String model) {
        // No validation per product requirements
    }

    public void validateReading(Instant timestamp, 
                              DeviceReading.SensorType sensorType,
                              String deviceId, 
                              Double value) {
        // No validation per product requirements
    }
}
