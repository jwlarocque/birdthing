
DROP TABLE IF EXISTS bird;

CREATE TABLE bird (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER,
    clutch_id INTEGER,
    band_num TEXT UNIQUE,
    male BOOLEAN,
    date_of_birth DATE,
    date_of_death DATE,
    nickname TEXT,
    "desc" TEXT,
    notes TEXT
);

INSERT INTO bird (
    band_num,
    male,
    date_of_birth,
    "desc",
    notes
) VALUES (
    'X001',
    TRUE,
    '2021-04-02',
    'test bird 1 desc',
    'notes about test bird 1😊'
), (
    'X002',
    TRUE,
    '2020-01-02',
    'test bird 2 desc',
    'notes about test bird 2'
);
