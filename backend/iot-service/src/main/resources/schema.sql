-- Create UUID functions for H2
CREATE ALIAS IF NOT EXISTS uuid_generate_v4 FOR "java.util.UUID.randomUUID";
