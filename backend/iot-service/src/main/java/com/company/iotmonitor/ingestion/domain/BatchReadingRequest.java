package com.company.iotmonitor.ingestion.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Schema(description = "Request payload for batch recording of device readings")
public class BatchReadingRequest {
    @NotNull
    @Schema(description = "Gateway ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
    private UUID gatewayId;

    @Valid
    @Size(min = 1, max = 1000)
    @Schema(description = "List of reading data", required = true)
    private List<ReadingRequest> data;
}