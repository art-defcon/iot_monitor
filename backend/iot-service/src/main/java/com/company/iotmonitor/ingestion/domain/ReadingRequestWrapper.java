package com.company.iotmonitor.ingestion.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(description = "Wrapper for single reading request")
public class ReadingRequestWrapper {
    @NotNull
    @Schema(description = "Gateway ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
    private UUID gatewayId;

    @Valid
    @Schema(description = "Reading data", required = true)
    private ReadingRequest data;
}