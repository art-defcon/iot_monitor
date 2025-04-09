-- Add model column and constraints for gateway management
ALTER TABLE devices ADD COLUMN IF NOT EXISTS model VARCHAR(50);
ALTER TABLE devices ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';

-- Add uniqueness constraint for gateway names
ALTER TABLE devices ADD CONSTRAINT uk_device_name UNIQUE (name);

-- Create model whitelist table
CREATE TABLE IF NOT EXISTS gateway_models (
    model_id VARCHAR(50) PRIMARY KEY,
    description VARCHAR(255),
    max_devices INTEGER
);

-- Insert common models
INSERT INTO gateway_models (model_id, description, max_devices) VALUES 
    ('IoT-GW-2000', 'Standard gateway', 50),
    ('IoT-GW-3000', 'Enterprise gateway', 200),
    ('IoT-GW-100', 'Mini gateway', 10)
ON CONFLICT DO NOTHING;