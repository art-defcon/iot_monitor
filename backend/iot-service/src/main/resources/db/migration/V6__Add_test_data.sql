INSERT INTO gateway (id, name, location) VALUES
('gw-1', 'Main Hub', 'Factory A'),
('gw-2', 'Backup Hub', 'Warehouse B');

INSERT INTO reading (id, gateway_id, sensor_type, value, timestamp) VALUES
-- 7 days of voltage readings for gw-1 (220-240V)
(uuid(), 'gw-1', 'VOLTAGE', 230.1, NOW() - INTERVAL 7 DAY),
(uuid(), 'gw-1', 'VOLTAGE', 231.5, NOW() - INTERVAL 6 DAY + INTERVAL 2 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 229.8, NOW() - INTERVAL 6 DAY + INTERVAL 4 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 232.2, NOW() - INTERVAL 5 DAY),
(uuid(), 'gw-1', 'VOLTAGE', 228.7, NOW() - INTERVAL 5 DAY + INTERVAL 3 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 235.0, NOW() - INTERVAL 4 DAY),
(uuid(), 'gw-1', 'VOLTAGE', 236.1, NOW() - INTERVAL 4 DAY + INTERVAL 1 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 234.5, NOW() - INTERVAL 3 DAY),
(uuid(), 'gw-1', 'VOLTAGE', 233.9, NOW() - INTERVAL 3 DAY + INTERVAL 5 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 237.2, NOW() - INTERVAL 2 DAY),
(uuid(), 'gw-1', 'VOLTAGE', 238.0, NOW() - INTERVAL 2 DAY + INTERVAL 2 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 239.1, NOW() - INTERVAL 1 DAY),
(uuid(), 'gw-1', 'VOLTAGE', 240.0, NOW() - INTERVAL 1 DAY + INTERVAL 4 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 239.5, NOW() - INTERVAL 12 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 238.8, NOW() - INTERVAL 6 HOUR),
(uuid(), 'gw-1', 'VOLTAGE', 237.9, NOW() - INTERVAL 3 HOUR),

-- 7 days of temperature readings for gw-1 (20-30°C)
(uuid(), 'gw-1', 'TEMPERATURE', 22.4, NOW() - INTERVAL 7 DAY),
(uuid(), 'gw-1', 'TEMPERATURE', 23.1, NOW() - INTERVAL 6 DAY + INTERVAL 2 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 21.8, NOW() - INTERVAL 6 DAY + INTERVAL 4 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 24.2, NOW() - INTERVAL 5 DAY),
(uuid(), 'gw-1', 'TEMPERATURE', 20.7, NOW() - INTERVAL 5 DAY + INTERVAL 3 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 25.0, NOW() - INTERVAL 4 DAY),
(uuid(), 'gw-1', 'TEMPERATURE', 26.1, NOW() - INTERVAL 4 DAY + INTERVAL 1 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 24.5, NOW() - INTERVAL 3 DAY),
(uuid(), 'gw-1', 'TEMPERATURE', 23.9, NOW() - INTERVAL 3 DAY + INTERVAL 5 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 27.2, NOW() - INTERVAL 2 DAY),
(uuid(), 'gw-1', 'TEMPERATURE', 28.0, NOW() - INTERVAL 2 DAY + INTERVAL 2 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 29.1, NOW() - INTERVAL 1 DAY),
(uuid(), 'gw-1', 'TEMPERATURE', 30.0, NOW() - INTERVAL 1 DAY + INTERVAL 4 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 29.5, NOW() - INTERVAL 12 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 28.8, NOW() - INTERVAL 6 HOUR),
(uuid(), 'gw-1', 'TEMPERATURE', 27.9, NOW() - INTERVAL 3 HOUR),

-- Some readings for gw-2
(uuid(), 'gw-2', 'VOLTAGE', 225.3, NOW() - INTERVAL 5 DAY),
(uuid(), 'gw-2', 'VOLTAGE', 226.7, NOW() - INTERVAL 4 DAY),
(uuid(), 'gw-2', 'VOLTAGE', 224.9, NOW() - INTERVAL 3 DAY),
(uuid(), 'gw-2', 'TEMPERATURE', 21.3, NOW() - INTERVAL 5 DAY),
(uuid(), 'gw-2', 'TEMPERATURE', 22.7, NOW() - INTERVAL 4 DAY),
(uuid(), 'gw-2', 'TEMPERATURE', 20.9, NOW() - INTERVAL 3 DAY);