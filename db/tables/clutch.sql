DROP TABLE IF EXISTS clutch;

CREATE TABLE clutch (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER,
    father_id INTEGER,
    mother_id INTEGER,
    nest_name TEXT,
    num_eggs INTEGER,
    num_hatched INTEGER,
    date_nesting DATE,
    date_paired DATE,
    date_sitting DATE,
    notes TEXT
);