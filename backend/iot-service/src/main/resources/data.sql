-- Insert test gateway with id=1000 (as UUID)
INSERT INTO gateways (gateway_id, name, location, model, status, registered_at) 
VALUES 
('00000000-0000-0000-0000-000000001000', 'Test Gateway', 'Test Location', 'TEST-GW-1000', 'ACTIVE', CURRENT_TIMESTAMP);

-- Insert test sensors (2 voltage, 2 humidity, 2 temp) linked to gateway 1000
INSERT INTO gateways (gateway_id, name, location, model, status, registered_at) 
VALUES 
('00000000-0000-0000-0000-000000001001', 'Voltage Sensor 1', 'Circuit A', 'VOLT-100', 'ACTIVE', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000001002', 'Voltage Sensor 2', 'Circuit B', 'VOLT-100', 'ACTIVE', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000001003', 'Humidity Sensor 1', 'Room A', 'HUM-200', 'ACTIVE', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000001004', 'Humidity Sensor 2', 'Room B', 'HUM-200', 'ACTIVE', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000001005', 'Temperature Sensor 1', 'Room A', 'TEMP-100', 'ACTIVE', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000001006', 'Temperature Sensor 2', 'Room B', 'TEMP-100', 'ACTIVE', CURRENT_TIMESTAMP);

-- Generate 7 days of readings for each sensor (every 15 minutes)
-- Voltage sensors: 220-240V
-- Humidity sensors: 30-70%
-- Temperature sensors: 18-25°C
DO $$
DECLARE
    sensor_ids TEXT[] := ARRAY[
        '00000000-0000-0000-0000-000000001001', -- Voltage 1
        '00000000-0000-0000-0000-000000001002', -- Voltage 2
        '00000000-0000-0000-0000-000000001003', -- Humidity 1
        '00000000-0000-0000-0000-000000001004', -- Humidity 2
        '00000000-0000-0000-0000-000000001005', -- Temp 1
        '00000000-0000-0000-0000-000000001006'  -- Temp 2
    ];
    sensor_labels TEXT[] := ARRAY['VOLTAGE', 'VOLTAGE', 'HUMIDITY', 'HUMIDITY', 'TEMPERATURE', 'TEMPERATURE'];
    units TEXT[] := ARRAY['V', 'V', '%', '%', '°C', '°C'];
    min_vals NUMERIC[] := ARRAY[220, 220, 30, 30, 18, 18];
    max_vals NUMERIC[] := ARRAY[240, 240, 70, 70, 25, 25];
    start_time TIMESTAMP := CURRENT_TIMESTAMP - INTERVAL '7 days';
    end_time TIMESTAMP := CURRENT_TIMESTAMP;
    current_time TIMESTAMP;
    i INTEGER;
    j INTEGER;
BEGIN
    FOR i IN 1..array_length(sensor_ids, 1) LOOP
        current_time := start_time;
        WHILE current_time <= end_time LOOP
            INSERT INTO readings (gateway_id, timestamp, sensor_label, unit, reading_value)
            VALUES (
                sensor_ids[i],
                current_time,
                sensor_labels[i],
                units[i],
                min_vals[i] + (random() * (max_vals[i] - min_vals[i]))
            );
            current_time := current_time + INTERVAL '15 minutes';
        END LOOP;
    END LOOP;
END $$;