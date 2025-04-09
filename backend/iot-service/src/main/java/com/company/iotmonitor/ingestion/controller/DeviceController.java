package com.company.iotmonitor.ingestion.controller;

import com.company.iotmonitor.ingestion.domain.Device;
import com.company.iotmonitor.ingestion.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/devices")
@Tag(name = "Device Management", description = "Endpoints for managing IoT devices")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    @Operation(summary = "List all registered devices")
    @ApiResponse(responseCode = "200", description = "List of devices",
                content = @Content(schema = @Schema(implementation = Device.class)))
    public ResponseEntity<List<Device>> listDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get device details")
    @ApiResponse(responseCode = "200", description = "Device details",
                content = @Content(schema = @Schema(implementation = Device.class)))
    @ApiResponse(responseCode = "404", description = "Device not found",
                content = @Content(schema = @Schema(implementation = String.class)))
    public ResponseEntity<Device> getDevice(@PathVariable UUID id) {
        return deviceService.getDeviceById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
