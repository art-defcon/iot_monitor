package com.company.iotmonitor.ingestion.repository;

import com.company.iotmonitor.ingestion.domain.Gateway;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GatewayRepository extends JpaRepository<Gateway, UUID> {
    Optional<Gateway> findByName(String name);
    
    // Add the method for gateway filtering
    List<Gateway> findByModelIsNotNull();
}
