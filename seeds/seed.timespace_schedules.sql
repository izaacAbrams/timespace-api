INSERT INTO timespace_schedules (schedule, schedule_url, time_open, time_closed, services)
  VALUES 
  (
  'Sally''s Salon & Spa',
  'sallys-salon-spa',
  '0800',
  '1700',
    '[
      {
        "name": "Nails",
        "duration": "50"
      },
      {
        "name": "Spa",
        "duration": "30"
      },
      {
        "name": "Cucumber on Eyes",
        "duration": "30"
      },
      {
        "name": "Mud Bath",
        "duration": "60"
      }
    ]'
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
    ]'
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
    ]'
  );