package com.company.iotmonitor.ingestion.repository;

import com.company.iotmonitor.ingestion.domain.Gateway;
import com.company.iotmonitor.ingestion.domain.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, String> {
    List<Reading> findByGatewayAndTimestampBetween(Gateway gateway, Instant start, Instant end);
    
    void deleteByGatewayGatewayId(UUID gatewayId);
}
