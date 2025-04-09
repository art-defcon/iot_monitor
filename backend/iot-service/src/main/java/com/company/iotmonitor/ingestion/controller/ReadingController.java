package com.company.iotmonitor.ingestion.controller;

import com.company.iotmonitor.ingestion.domain.Gateway;
import com.company.iotmonitor.ingestion.domain.Reading;
import com.company.iotmonitor.ingestion.service.GatewayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/readings")
@Tag(name = "Reading Management", description = "Endpoints for managing gateway readings")
public class ReadingController {
    private static final Logger logger = LoggerFactory.getLogger(ReadingController.class);
    private static final int MAX_BATCH_SIZE = 1000;

    private final GatewayService gatewayService;

    public ReadingController(GatewayService gatewayService) {
        this.gatewayService = gatewayService;
    }

    @PostMapping
    @Operation(summary = "Record a single reading",
               description = "Records a single reading for a gateway. Rate limited to 100 requests per minute.")
    @ApiResponse(responseCode = "202", description = "Reading accepted for processing")
    @ApiResponse(responseCode = "400", description = "Invalid input data",
                content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "404", description = "Gateway not found",
                content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "429", description = "Too many requests",
                content = @Content(schema = @Schema(implementation = String.class)))
    public ResponseEntity<Void> submitReading(@Valid @RequestBody ReadingRequestWrapper request) {
        logger.info("Recording reading for gateway {}", request.getGatewayId());
        gatewayService.recordReading(
            request.getGatewayId(),
            request.getData().getTimestamp(),
            request.getData().getSensor(),
            request.getData().getUnit(),
            request.getData().getReading());
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/batch")
    @Operation(summary = "Record batch readings",
               description = "Records multiple readings for a gateway in one request. Rate limited to 50 requests per minute.")
    @ApiResponse(responseCode = "202", description = "Readings accepted for processing")
    @ApiResponse(responseCode = "400", description = "Invalid input data", // Includes gateway not found case now
                content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "404", description = "Gateway not found", // Note: This might be masked by 400 due to throwing IllegalArgumentException
                content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "413", description = "Request payload too large",
                content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "429", description = "Too many requests",
                content = @Content(schema = @Schema(implementation = String.class)))
    public ResponseEntity<Void> submitBatchReadings(@Valid @RequestBody BatchReadingRequest request) {
        if (request.getData().size() > MAX_BATCH_SIZE) {
            throw new IllegalArgumentException("Batch size exceeds maximum of " + MAX_BATCH_SIZE);
        }

        logger.info("Recording {} readings for gateway {}", request.getData().size(), request.getGatewayId());
        logger.debug("submitBatchReadings: request={}", request);

        // Fetch the managed Gateway entity using the gatewayId, handling Optional
        Gateway managedGateway = gatewayService.getGatewayById(request.getGatewayId())
                .orElseThrow(() -> new IllegalArgumentException("Gateway not found with ID: " + request.getGatewayId()));


        List<Reading> readings = request.getData().stream()
        	.map(req -> {
                logger.debug("ReadingRequest: {}", req);
                return new Reading(
                    null,
                    managedGateway, // Use the fetched managed gateway
                    req.getTimestamp(),
                    req.getSensor(),
                    req.getUnit(),
                    req.getReading());
            })
            .toList();
        gatewayService.recordBatchReadings(readings);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{gatewayId}")
    @Cacheable(value = "readings", key = "{#gatewayId, #start, #end}")
    @Operation(summary = "Get readings for gateway",
               description = "Returns readings for a gateway within a time range. Rate limited to 100 requests per minute.")
    @ApiResponse(responseCode = "200", description = "List of readings",
                content = @Content(schema = @Schema(implementation = Reading[].class)))
    @ApiResponse(responseCode = "400", description = "Invalid time range",
                content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "404", description = "Gateway not found",
                content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "429", description = "Too many requests",
                content = @Content(schema = @Schema(implementation = String.class)))
    public List<Reading> getReadings(
            @Parameter(description = "ID of the gateway", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable UUID gatewayId,
            @Parameter(description = "Start of time range (UTC)", required = true, example = "2025-07-04T00:00:00Z")
            @RequestParam Instant start,
            @Parameter(description = "End of time range (UTC)", required = true, example = "2025-07-04T23:59:59Z")
            @RequestParam Instant end) {
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        logger.info("Fetching readings for gateway {} between {} and {}", gatewayId, start, end);
        return gatewayService.getReadings(gatewayId, start, end);
    }

    @Schema(description = "Request payload for a single reading")
    public static class ReadingRequest {
        private Instant timestamp;
        private String sensor;
        private String unit;
        private Double reading;

        public ReadingRequest() {}

        public Instant getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Instant timestamp) {
            this.timestamp = timestamp;
        }

        public String getSensor() {
            return sensor;
        }

        public void setSensor(String sensor) {
            this.sensor = sensor;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public Double getReading() {
            return reading;
        }

        public void setReading(Double reading) {
            this.reading = reading;
        }

        @Override
        public String toString() {
            return "ReadingRequest{" +
                    "timestamp=" + timestamp +
                    ", sensor='" + sensor + '\'' +
                    ", unit='" + unit + '\'' +
                    ", reading=" + reading +
                    '}';
        }
    }

    @Schema(description = "Wrapper for a single reading request")
    public static class ReadingRequestWrapper {
        private UUID gatewayId;
        private ReadingRequest data;

        public ReadingRequestWrapper() {}

        public UUID getGatewayId() {
            return gatewayId;
        }

        public void setGatewayId(UUID gatewayId) {
            this.gatewayId = gatewayId;
        }

        public ReadingRequest getData() {
            return data;
        }

        public void setData(ReadingRequest data) {
            this.data = data;
        }
    }

    @Schema(description = "Request payload for batch readings")
    public static class BatchReadingRequest {
        private UUID gatewayId;
        private List<ReadingRequest> data;

        public BatchReadingRequest() {}

        public UUID getGatewayId() {
            return gatewayId;
        }

        public void setGatewayId(UUID gatewayId) {
            this.gatewayId = gatewayId;
        }

        public List<ReadingRequest> getData() {
            return data;
        }

        public void setData(List<ReadingRequest> data) {
            this.data = data;
        }

        @Override
        public String toString() {
            return "BatchReadingRequest{" +
                    "gatewayId=" + gatewayId +
                    ", data=" + data +
                    '}';
        }
    }
}
