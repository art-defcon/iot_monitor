-- Gateways
INSERT INTO gateway (gateway_id, name, location, model, status, registered_at) VALUES
('a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', 'Summer House', '59.329323, 18.068581', 'GW-2000', 'ACTIVE', '2025-04-01 08:00:00'),
('b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', 'Barn', '59.328714, 18.072196', 'GW-2000', 'ACTIVE', '2025-04-01 08:15:00');

-- Summer House Sensors
INSERT INTO reading (reading_id, gateway_id, timestamp, sensor_label, unit, reading_value) VALUES
-- Battery 1 Voltage (12.6V ±0.5V)
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:00:00', 'battery 1', 'volt', 12.4),
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:15:00', 'battery 1', 'volt', 12.7),
-- Battery 2 Voltage
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:00:00', 'battery 2', 'volt', 12.5),
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:15:00', 'battery 2', 'volt', 12.8),
-- House Temperature (18°C ±10°C)
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:00:00', 'house', 'celsius', 20.1),
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:15:00', 'house', 'celsius', 19.8),
-- Outdoor Temperature
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:00:00', 'outdoor', 'celsius', 15.2),
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:15:00', 'outdoor', 'celsius', 14.9),
-- Indoor Humidity (50% ±30%)
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:00:00', 'indoor', 'percent', 45),
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:15:00', 'indoor', 'percent', 48),
-- Shed Humidity
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:00:00', 'shed', 'percent', 55),
(uuid_generate_v4(), 'a6b3c2d1-e8f3-4a7c-b229-1f25b9c8d47a', '2025-04-01 08:15:00', 'shed', 'percent', 53);

-- Barn Sensors
INSERT INTO reading (reading_id, gateway_id, timestamp, sensor_label, unit, reading_value) VALUES
-- Boat Battery Voltage
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:00:00', 'boat battery', 'volt', 12.3),
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:15:00', 'boat battery', 'volt', 12.6),
-- Solar Battery Voltage
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:00:00', 'solar battery', 'volt', 13.1),
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:15:00', 'solar battery', 'volt', 13.4),
-- Inhouse Temperature (25°C ±5°C)
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:00:00', 'inhouse', 'celsius', 23.5),
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:15:00', 'inhouse', 'celsius', 24.1),
-- Battery Temperature
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:00:00', 'battery temperature', 'celsius', 27.3),
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:15:00', 'battery temperature', 'celsius', 26.8),
-- Garden Humidity
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:00:00', 'garden', 'percent', 62),
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:15:00', 'garden', 'percent', 65),
-- Flower Bed Humidity
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:00:00', 'flower bed', 'percent', 70),
(uuid_generate_v4(), 'b7c4d5e6-f8g9-4h0i-j1k2-l3m4n5o6p7q8', '2025-04-01 08:15:00', 'flower bed', 'percent', 68);
