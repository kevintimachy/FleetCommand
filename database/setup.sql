-- Enums
CREATE TYPE robot_status AS ENUM (
  'idle',
  'moving',
  'working',
  'charging',
  'error',
  'offline'
);

CREATE TYPE robot_command AS ENUM (
  'move',
  'work',
  'charge',
  'stop',
  'shutdown'
);

-- Facilities table
CREATE TABLE facilities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Robots table
CREATE TABLE robots (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status robot_status DEFAULT 'idle',
  battery INTEGER DEFAULT 100 CHECK (battery >= 0 AND battery <= 100),
  facility_id INTEGER REFERENCES facilities(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commands table
CREATE TABLE commands (
  id SERIAL PRIMARY KEY,
  robot_id INTEGER REFERENCES robots(id),
  command robot_command NOT NULL,
  previous_status robot_status,
  new_status robot_status,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Function to auto update updated_at on robots
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call that function whenever a robot row is updated
CREATE TRIGGER robots_updated_at
BEFORE UPDATE ON robots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Seed facilities
INSERT INTO facilities (name, location) VALUES
  ('Warehouse A', 'North York'),
  ('Hospital B', 'Downtown Toronto'),
  ('Manufacturing Plant C', 'Scarborough'),
  ('Distribution Center D', 'Mississauga');

-- Seed robots
INSERT INTO robots (name, status, battery, facility_id) VALUES
  ('R1-Alpha', 'idle', 100, 1),
  ('R2-Bravo', 'moving', 72, 1),
  ('R3-Charlie', 'working', 85, 1),
  ('R4-Delta', 'error', 18, 2),
  ('R5-Echo', 'idle', 95, 2),
  ('R6-Foxtrot', 'moving', 60, 2),
  ('R7-Golf', 'charging', 30, 3),
  ('R8-Hotel', 'working', 88, 3),
  ('R9-India', 'moving', 55, 3),
  ('R10-Juliet', 'error', 12, 4),
  ('R11-Kilo', 'offline', 0, 4),
  ('R12-Lima', 'charging', 25, 4);