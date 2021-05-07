DROP TABLE IF EXISTS result;

CREATE TABLE result (
    id SERIAL PRIMARY KEY,
    bird_id INTEGER,
    "date" DATE,
    competition_name TEXT,
    competitiveness INTEGER,
    performance INTEGER,
    notes TEXT
);