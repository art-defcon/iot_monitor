-- Create devices table with new schema
CREATE TABLE IF NOT EXISTS devices (
    device_id UUID PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    location VARCHAR(255),
    max_capacity_kw DECIMAL(10,2),
    registered_at TIMESTAMP
);

-- Create device_readings table with new schema
CREATE TABLE IF NOT EXISTS device_readings (
    id VARCHAR(36) PRIMARY KEY,
    device_id UUID REFERENCES devices(device_id),
    timestamp TIMESTAMP,
    power_kw DECIMAL(10,2),
    voltage DECIMAL(10,2)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_device_readings_device_id ON device_readings(device_id);
CREATE INDEX IF NOT EXISTS idx_device_readings_timestamp ON device_readings(timestamp);

-- Create materialized view for daily summaries
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_energy_summary AS
SELECT 
    device_id,
    DATE(timestamp) AS day,
    SUM(CASE WHEN power_kw > 0 THEN power_kw ELSE 0 END) AS total_production_kwh,
    SUM(CASE WHEN power_kw < 0 THEN ABS(power_kw) ELSE 0 END) AS total_consumption_kwh,
    MAX(CASE WHEN power_kw > 0 THEN power_kw ELSE 0 END) AS peak_production_kw,
    MAX(CASE WHEN power_kw < 0 THEN ABS(power_kw) ELSE 0 END) AS peak_consumption_kw
FROM device_readings
GROUP BY device_id, DATE(timestamp);

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_summary_device_day ON daily_energy_summary(device_id, day);
