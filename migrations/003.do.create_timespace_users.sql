CREATE TABLE timespace_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE timespace_schedules 
  ADD COLUMN 
    user_id INTEGER REFERENCES timespace_users(id)
      ON DELETE CASCADE;