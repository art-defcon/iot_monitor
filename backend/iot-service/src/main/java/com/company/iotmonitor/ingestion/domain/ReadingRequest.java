package com.company.iotmonitor.ingestion.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

import java.time.Instant;

@Data
@Schema(description = "Request payload for recording a device reading")
public class ReadingRequest {
    @NotNull
    @Schema(description = "Sensor type", example = "TEMPERATURE", required = true)
    private DeviceReading.SensorType sensor;

    @NotBlank
    @Schema(description = "Measurement unit", example = "°C", required = true)
    private String unit;

    @NotNull
    @Schema(description = "Reading value", example = "23.5", required = true)
    private Double reading;

    @PastOrPresent
    @NotNull
    @Schema(description = "Timestamp of reading (UTC)", example = "2025-07-04T12:00:00Z", required = true)
    private Instant timestamp;
}