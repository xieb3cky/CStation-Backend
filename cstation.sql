\echo 'Delete and recreate cstation db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE cstation;
CREATE DATABASE cstation;
\connect cstation

\i cstation-schema.sql
-- \i cstation-seed.sql

\echo 'Delete and recreate cstation_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE cstation_test;
CREATE DATABASE cstation_test;
\connect cstation_test

\i cstation-schema.sql

