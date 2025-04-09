package com.company.iotmonitor.ingestion.repository;

import com.company.iotmonitor.ingestion.domain.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {
    Optional<Device> findByName(String name);
    
    // Add the new method for gateway filtering
    List<Device> findByModelIsNotNull();
}
