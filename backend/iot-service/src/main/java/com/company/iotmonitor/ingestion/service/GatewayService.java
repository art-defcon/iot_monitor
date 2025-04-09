package com.company.iotmonitor.ingestion.service;

import com.company.iotmonitor.ingestion.domain.Gateway;
import com.company.iotmonitor.ingestion.domain.Reading;
import com.company.iotmonitor.ingestion.repository.GatewayRepository;
import com.company.iotmonitor.ingestion.repository.ReadingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GatewayService {
    private static final Logger logger = LoggerFactory.getLogger(GatewayService.class);
    private final GatewayRepository gatewayRepository;
    private final ReadingRepository readingRepository;

    public GatewayService(GatewayRepository gatewayRepository,
                       ReadingRepository readingRepository) {
        this.gatewayRepository = gatewayRepository;
        this.readingRepository = readingRepository;
    }

    @Transactional
    public Gateway registerGateway(String name, String location, String model) {
        logger.debug("registerGateway: name={}, location={}, model={}", name, location, model);
        // Check for existing gateway by name
        return gatewayRepository.findByName(name)
            .map(existing -> {
                logger.debug("registerGateway: existing gateway found - {}", existing);
                existing.setLocation(location);
                existing.setModel(model);
                Gateway saved = gatewayRepository.save(existing);
                logger.debug("registerGateway: updated gateway - {}", saved);
                return saved;
            })
            .orElseGet(() -> {
                Gateway gateway = new Gateway();
                gateway.setName(name);
                gateway.setLocation(location);
                gateway.setModel(model);
                Gateway saved = gatewayRepository.save(gateway);
                logger.debug("registerGateway: new gateway created - {}", saved);
                return saved;
            });
    }

    @Transactional
    public Optional<Gateway> updateGateway(UUID gatewayId, String name, String location, String model) {
        logger.debug("updateGateway: gatewayId={}, name={}, location={}, model={}", gatewayId, name, location, model);
        return gatewayRepository.findById(gatewayId).map(gateway -> {
            logger.debug("updateGateway: gateway found - {}", gateway);
            if (name != null) gateway.setName(name);
            if (location != null) gateway.setLocation(location);
            if (model != null) gateway.setModel(model);
            Gateway saved = gatewayRepository.save(gateway);
            logger.debug("updateGateway: updated gateway - {}", saved);
            return saved;
        });
    }

    @Transactional
    public boolean deleteGateway(UUID gatewayId) {
        logger.debug("deleteGateway: gatewayId={}", gatewayId);
        return gatewayRepository.findById(gatewayId).map(gateway -> {
            logger.debug("deleteGateway: gateway found - {}", gateway);
            // Delete all readings for this gateway
            readingRepository.deleteByGatewayGatewayId(gatewayId);
            // Delete the gateway
            gatewayRepository.delete(gateway);
            logger.debug("deleteGateway: gateway deleted");
            return true;
        }).orElse(false);
    }

    @Transactional
    public void recordReading(UUID gatewayId, Instant timestamp,
                            String sensorLabel, String unit, Double readingValue) {
        logger.debug("recordReading: gatewayId={}, timestamp={}, sensorLabel={}, unit={}, readingValue={}", 
                    gatewayId, timestamp, sensorLabel, unit, readingValue);
        Gateway gateway = gatewayRepository.findById(gatewayId)
            .orElseThrow(() -> new IllegalArgumentException("Gateway not found"));
        
        // No validation per requirements

        Reading reading = new Reading();
        reading.setGateway(gateway);
        reading.setTimestamp(timestamp);
        reading.setSensorLabel(sensorLabel);
        reading.setUnit(unit);
        reading.setReadingValue(readingValue);
        
        readingRepository.save(reading);
    }

    @Transactional
    public void recordBatchReadings(List<Reading> readings) {
        if (readings.isEmpty()) {
            throw new IllegalArgumentException("Batch readings cannot be empty");
        }

        for (Reading reading : readings) {
            Gateway gateway = reading.getGateway();
            
            if (gateway == null) {
                throw new IllegalArgumentException("Gateway must be set for all readings");
            }

            // No validation per requirements
        }

        logger.debug("recordBatchReadings: readings={}", readings);
        readingRepository.saveAll(readings);
    }

    public Optional<Gateway> getGatewayById(UUID gatewayId) {
        return gatewayRepository.findById(gatewayId);
    }

    public List<Gateway> getAllGateways() {
        return gatewayRepository.findByModelIsNotNull();
    }

    public List<Gateway> getAllDevices() {
        return gatewayRepository.findAll();
    }

    public List<Reading> getReadings(UUID gatewayId, Instant start, Instant end) {
        Gateway gateway = gatewayRepository.findById(gatewayId)
            .orElseThrow(() -> new IllegalArgumentException("Gateway not found"));
        return readingRepository.findByGatewayAndTimestampBetween(gateway, start, end);
    }
}
