ALTER TABLE device_readings
  DROP COLUMN temperature,
  DROP COLUMN humidity,
  DROP COLUMN battery_voltage,
  ADD COLUMN sensor_type VARCHAR(20) NOT NULL,
  ADD COLUMN unit VARCHAR(10) NOT NULL,
  ADD COLUMN reading_value DECIMAL NOT NULL;