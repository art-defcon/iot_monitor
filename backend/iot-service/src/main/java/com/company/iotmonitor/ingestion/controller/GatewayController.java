package com.company.iotmonitor.ingestion.controller;

import com.company.iotmonitor.ingestion.domain.Gateway;
import com.company.iotmonitor.ingestion.service.GatewayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/gateways")
@Tag(name = "Gateway Management", description = "Endpoints for managing IoT gateways")
public class GatewayController {
    private final GatewayService gatewayService;

    public GatewayController(GatewayService gatewayService) {
        this.gatewayService = gatewayService;
    }

    @GetMapping
    @Operation(summary = "List all registered gateways")
    @ApiResponse(responseCode = "200", description = "List of gateways",
                content = @Content(schema = @Schema(implementation = Gateway.class)))
    public ResponseEntity<List<Gateway>> listGateways() {
        return ResponseEntity.ok(gatewayService.getAllGateways());
    }

    @PostMapping("/gateways")
    @Operation(summary = "Register a new IoT gateway")
    @ApiResponse(responseCode = "201", description = "Gateway created successfully")
    public ResponseEntity<Void> registerGateway(
            @RequestBody GatewayRegistrationRequest request,
            UriComponentsBuilder uriBuilder) {
        Gateway gateway = gatewayService.registerGateway(
            request.name(),
            request.location(),
            request.model());
        URI location = uriBuilder.path("/gateways/{id}").buildAndExpand(gateway.getGatewayId()).toUri();
        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get gateway details")
    @ApiResponse(responseCode = "200", description = "Gateway details",
                content = @Content(schema = @Schema(implementation = Gateway.class)))
    @ApiResponse(responseCode = "404", description = "Gateway not found",
                content = @Content(schema = @Schema(implementation = String.class)))
    public ResponseEntity<Gateway> getGateway(@PathVariable UUID id) {
        return gatewayService.getGatewayById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update gateway metadata")
    @ApiResponse(responseCode = "200", description = "Gateway updated successfully",
                content = @Content(schema = @Schema(implementation = Gateway.class)))
    @ApiResponse(responseCode = "404", description = "Gateway not found")
    public ResponseEntity<Gateway> updateGateway(
            @PathVariable UUID id,
            @RequestBody GatewayUpdateRequest request) {
        return gatewayService.updateGateway(id, request.name(), request.location(), request.model())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a gateway and all its readings")
    @ApiResponse(responseCode = "204", description = "Gateway deleted successfully")
    @ApiResponse(responseCode = "404", description = "Gateway not found")
    public ResponseEntity<Void> deleteGateway(@PathVariable UUID id) {
        boolean deleted = gatewayService.deleteGateway(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Schema(description = "Request payload for registering a new gateway")
    public record GatewayRegistrationRequest(
            @Schema(description = "Human-readable gateway name", example = "Main Floor Sensor", required = true)
            String name,

            @Schema(description = "Gateway location", example = "Building A, Floor 2", required = true)
            String location,

            @Schema(description = "Gateway model", example = "IoT-GW-2000", required = true)
            String model) {}

    @Schema(description = "Request payload for updating gateway metadata")
    public record GatewayUpdateRequest(
            @Schema(description = "Updated gateway name", example = "Main Floor Sensor")
            String name,

            @Schema(description = "Updated location", example = "Building A, Floor 2")
            String location,

            @Schema(description = "Updated model", example = "IoT-GW-3000")
            String model) {}
}
