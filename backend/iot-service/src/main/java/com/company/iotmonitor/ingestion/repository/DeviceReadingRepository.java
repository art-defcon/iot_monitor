package com.company.iotmonitor.ingestion.repository;

import com.company.iotmonitor.ingestion.domain.Device;
import com.company.iotmonitor.ingestion.domain.DeviceReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceReadingRepository extends JpaRepository<DeviceReading, String> {
    List<DeviceReading> findByDeviceAndTimestampBetween(Device device, Instant start, Instant end);
}
