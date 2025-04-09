-- Rename device_readings.id to deviceReadingId
ALTER TABLE device_readings RENAME COLUMN id TO deviceReadingId;

-- Update materialized view to use new column name
DROP MATERIALIZED VIEW IF EXISTS daily_sensor_summary;

CREATE MATERIALIZED VIEW IF NOT EXISTS daily_sensor_summary AS
SELECT 
    device_id,
    DATE(timestamp) AS day,
    AVG(temperature) AS avg_temperature,
    MIN(temperature) AS min_temperature,
    MAX(temperature) AS max_temperature,
    AVG(humidity) AS avg_humidity,
    AVG(battery_voltage) AS avg_battery_voltage
FROM device_readings
GROUP BY device_id, DATE(timestamp);

-- Recreate index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_sensor_summary_device_day ON daily_sensor_summary(device_id, day);