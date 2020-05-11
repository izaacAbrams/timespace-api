CREATE TABLE timespace_appointments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  schedule INTEGER
    REFERENCES timespace_schedules(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL,
  appt_date_time TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
