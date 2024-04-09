-- Create the 'metrics' table
CREATE TABLE metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID NOT NULL,
    energy_consumed DECIMAL(10, 2) NOT NULL,
    energy_produced DECIMAL(10, 2) NOT NULL,
    datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
);
