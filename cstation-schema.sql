CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  profile_img VARCHAR
);

CREATE TABLE stations (
  id INTEGER PRIMARY KEY,
  name TEXT,
  address TEXT NOT NULL,
  lat FLOAT NOT NULL,
  long FLOAT NOT NULL,
  charger_type TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  available INTEGER
);

-- CREATE TABLE reviews(
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users ON DELETE CASCADE,
--     station_id INTEGER REFERENCES stations ON DELETE CASCADE,
--     title TEXT NOT NULL,
--     review TEXT NOT NULL, 
--     rating INTEGER,
--     r_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE favorites(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations ON DELETE CASCADE
);

