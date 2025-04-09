package com.company.iotmonitor.ingestion.service;

import com.company.iotmonitor.ingestion.domain.Device;
import com.company.iotmonitor.ingestion.domain.DeviceReading;
import com.company.iotmonitor.ingestion.domain.DeviceReading.SensorType;
import com.company.iotmonitor.ingestion.repository.DeviceRepository;
import com.company.iotmonitor.ingestion.repository.DeviceReadingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {
    private static final Logger logger = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;
    private final DeviceReadingRepository readingRepository;

    public DeviceService(DeviceRepository deviceRepository,
                       DeviceReadingRepository readingRepository) {
        this.deviceRepository = deviceRepository;
        this.readingRepository = readingRepository;
    }

    @Transactional
    public Device registerGateway(String name, String location, String model) {
        logger.debug("registerGateway: name={}, location={}, model={}", name, location, model);
        // Check for existing gateway by name
        return deviceRepository.findByName(name)
            .map(existing -> {
                logger.debug("registerGateway: existing gateway found - {}", existing);
                existing.setLocation(location);
                existing.setModel(model);
                Device saved = deviceRepository.save(existing);
                logger.debug("registerGateway: updated gateway - {}", saved);
                return saved;
            })
            .orElseGet(() -> {
                Device gateway = new Device();
                gateway.setName(name);
                gateway.setLocation(location);
                gateway.setModel(model);
                Device saved = deviceRepository.save(gateway);
                logger.debug("registerGateway: new gateway created - {}", saved);
                return saved;
            });
    }

    @Transactional
    public Optional<Device> updateGateway(UUID deviceId, String name, String location, String model) {
        logger.debug("updateGateway: deviceId={}, name={}, location={}, model={}", deviceId, name, location, model);
        return deviceRepository.findById(deviceId).map(device -> {
            logger.debug("updateGateway: device found - {}", device);
            if (name != null) device.setName(name);
            if (location != null) device.setLocation(location);
            if (model != null) device.setModel(model);
            Device saved = deviceRepository.save(device);
            logger.debug("updateGateway: updated device - {}", saved);
            return saved;
        });
    }

    @Transactional
    public void recordReading(UUID deviceId, Instant timestamp,
                            SensorType sensorType, String unit, Double readingValue) {
        logger.debug("recordReading: deviceId={}, timestamp={}, sensorType={}, unit={}, readingValue={}", deviceId, timestamp, sensorType, unit, readingValue);
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new IllegalArgumentException("Device not found"));
        
        // No validation per requirements

        DeviceReading reading = new DeviceReading();
        reading.setDevice(device);
        reading.setTimestamp(timestamp);
        reading.setSensorType(sensorType);
        reading.setUnit(unit);
        reading.setReadingValue(readingValue);
        
        readingRepository.save(reading);
    }

    @Transactional
    public void recordBatchReadings(List<DeviceReading> readings) {
        if (readings.isEmpty()) {
            throw new IllegalArgumentException("Batch readings cannot be empty");
        }

        for (DeviceReading reading : readings) {
            Device device = reading.getDevice();
            
            if (device == null) {
                throw new IllegalArgumentException("Device must be set for all readings");
            }

            // No validation per requirements
        }

        logger.debug("recordBatchReadings: readings={}", readings);
        readingRepository.saveAll(readings);
    }

    public Optional<Device> getDeviceById(UUID deviceId) {
        return deviceRepository.findById(deviceId);
    }

    public List<Device> getAllGateways() {
        return deviceRepository.findByModelIsNotNull();
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public List<DeviceReading> getReadings(UUID deviceId, Instant start, Instant end) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new IllegalArgumentException("Device not found"));
        return readingRepository.findByDeviceAndTimestampBetween(device, start, end);
    }
}
