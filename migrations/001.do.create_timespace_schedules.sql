CREATE TABLE timespace_schedules (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  schedule TEXT NOT NULL,
  schedule_url TEXT NOT NULL UNIQUE,
  time_open TEXT NOT NULL,
  time_closed TEXT NOT NULL,
  services jsonb NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);