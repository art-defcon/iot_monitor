-- Rename devices table to gateways
ALTER TABLE devices RENAME TO gateways;

-- Rename device_id column to gateway_id in the gateways table
ALTER TABLE gateways RENAME COLUMN device_id TO gateway_id;

-- Rename device_readings table to readings
ALTER TABLE device_readings RENAME TO readings;

-- Rename device_reading_id column to reading_id in the readings table
ALTER TABLE readings RENAME COLUMN device_reading_id TO reading_id;

-- Rename device_id column to gateway_id in the readings table
ALTER TABLE readings RENAME COLUMN device_id TO gateway_id;

-- Add sensor_label column to readings table
ALTER TABLE readings ADD COLUMN sensor_label VARCHAR(100);

-- Update sensor_label with values from sensor_type (to preserve existing data)
UPDATE readings SET sensor_label = sensor_type::text;

-- Make sensor_label not nullable
ALTER TABLE readings ALTER COLUMN sensor_label SET NOT NULL;

-- Drop the sensor_type column as it's no longer needed
ALTER TABLE readings DROP COLUMN sensor_type;

-- Update foreign key constraint
ALTER TABLE readings DROP CONSTRAINT IF EXISTS device_readings_device_id_fkey;
ALTER TABLE readings ADD CONSTRAINT readings_gateway_id_fkey 
    FOREIGN KEY (gateway_id) REFERENCES gateways(gateway_id) ON DELETE CASCADE;

-- Update indexes
DROP INDEX IF EXISTS idx_device_readings_device_id;
DROP INDEX IF EXISTS idx_device_readings_timestamp;
CREATE INDEX idx_readings_gateway_id ON readings(gateway_id);
CREATE INDEX idx_readings_timestamp ON readings(timestamp);
CREATE INDEX idx_readings_sensor_label ON readings(sensor_label);

-- Drop and recreate the materialized view
DROP MATERIALIZED VIEW IF EXISTS daily_sensor_summary;
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_sensor_summary AS
SELECT 
    gateway_id,
    sensor_label,
    DATE(timestamp) AS day,
    AVG(reading_value) AS avg_value,
    MIN(reading_value) AS min_value,
    MAX(reading_value) AS max_value,
    unit
FROM readings
GROUP BY gateway_id, sensor_label, DATE(timestamp), unit;

-- Create index on new materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_sensor_summary_gateway_sensor_day 
    ON daily_sensor_summary(gateway_id, sensor_label, day, unit);
