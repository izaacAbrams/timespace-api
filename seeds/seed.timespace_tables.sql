BEGIN;

TRUNCATE 
  timespace_schedules,
  timespace_appointments,
  timespace_users
  RESTART IDENTITY CASCADE;

INSERT INTO timespace_users (name, email, password)
  VALUES
    ('Izaac Abrams', 'izaac@izaac.com', '$2a$12$xvPz6h6drBplEe7sXb1I3uMHsL.sIZW0TPaj08..T6H6ngz5gerbC'),
    ('Test One', 'test@test.com', '$2a$12$y8d/lWQOEDEpVeLTTfn0BupwYDA0j4yF1XzkNsmHP.eINowIKijvm'),
    ('Demo', 'demo@account.com', '$2b$12$PWnPB5HBoz3jN7wH.f4z4eHGXU5sRnJpNVs6inJKkF6h4sl3ipSHi');


INSERT INTO timespace_schedules (schedule, schedule_url, time_open, time_closed, services, user_id)
  VALUES 
  (
  'Sally''s Salon & Spa',
  'sallys-salon-spa',
  '0800',
  '1700',
  '[{"name": "Nails","duration": "50"},
    {"name": "Spa","duration": "30"},
    {"name": "Cucumber on Eyes","duration": "30"},
    {"name": "Mud Bath","duration": "60"}]',
    '1'
  ),
  (
  'Mike''s Pokemon Training',
  'mikes-pokemon-training',
  '0600',
  '2200',
    '[
      {
        "name": "Train",
        "duration": "60"
      },
      {
        "name": "Battle",
        "duration": "30"
      },
      {
        "name": "Lose for money",
        "duration": "10"
      }
    ]',
    '1'
  ),
  (
    'Music to study to',
    'music-to-study-to',
    '0700',
    '2000',
    '[
      {
        "name": "Jazz",
        "duration": "100"
      },
      {
        "name": "Soul",
        "duration": "50"
      },
      {
        "name": "Hip-Hop",
        "duration": "30"
      }
    ]',
    '2'
  );

INSERT INTO timespace_appointments(name, email, schedule, service, appt_date_time) 
  VALUES 
  (
    'Joe Smith', 'joesmith@google.com',  1, 'Nails', '2020-05-08T16:00:00.000Z'
  ),
  (
    'Jane Smith', 'janesmith@microsoft.com', 1, 'Salon', '2020-05-08T14:00:00.000Z'
  ),
  (
    'Izaac A', 'izaaca@izaac.com', 2, 'training', '2020-05-08T18:00:00.000Z'
  );

  COMMIT;