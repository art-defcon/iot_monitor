-- Update devices table
ALTER TABLE devices 
DROP COLUMN max_capacity_kw,
ADD COLUMN manufacturer VARCHAR(100),
ADD COLUMN model VARCHAR(100),
ALTER COLUMN type TYPE VARCHAR(50) USING 
    CASE type 
        WHEN 'SOLAR' THEN 'TEMPERATURE'
        WHEN 'WIND' THEN 'HUMIDITY' 
        WHEN 'BATTERY' THEN 'BATTERY'
        ELSE 'TEMPERATURE'
    END;

-- Update device_readings table
ALTER TABLE device_readings
DROP COLUMN power_kw,
DROP COLUMN voltage,
ADD COLUMN temperature DECIMAL(5,2),
ADD COLUMN humidity DECIMAL(5,2),
ADD COLUMN battery_voltage DECIMAL(5,2);

-- Drop old materialized view
DROP MATERIALIZED VIEW IF EXISTS daily_energy_summary;

-- Create new view for sensor data summaries
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

-- Create index on new materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_sensor_summary_device_day ON daily_sensor_summary(device_id, day);