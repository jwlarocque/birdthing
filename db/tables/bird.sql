
DROP TABLE IF EXISTS bird;

CREATE TABLE bird (
    id SERIAL PRIMARY KEY,
    band_num TEXT,
    owner_id INTEGER,
    male BOOLEAN,
    date_of_birth DATE,
    date_of_death DATE,
    nick TEXT,
    notes TEXT,
    father_id INTEGER,
    mother_id INTEGER
);

INSERT INTO bird (
    band_num,
    male,
    date_of_birth,
    notes
) VALUES (
    'X001',
    TRUE,
    '2021-04-02',
    'notes about test bird 1😊'
), (
    'X002',
    TRUE,
    '2020-01-02',
    'notes about test bird 2'
);
