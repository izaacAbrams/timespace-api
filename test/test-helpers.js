function makeSchedulesArray() {
  return [
    {
      id: "1",
      schedule: "Sally's Salon & Spa",
      schedule_url: "sallys-salon-spa",
      time_open: "0800",
      time_closed: "1700",
      services: JSON.stringify([
        {
          name: "Nails",
          duration: "50",
        },
        {
          name: "Spa",
          duration: "30",
        },
        {
          name: "Cucumber on Eyes",
          duration: "30",
        },
        {
          name: "Mud Bath",
          duration: "60",
        },
      ]),
    },
    {
      id: "2",
      schedule: "Mike's Pokemon Training",
      schedule_url: "mikes-pokemon-training",
      time_open: "0600",
      time_closed: "2200",
      services: JSON.stringify([
        {
          name: "Train",
          duration: "60",
        },
        {
          name: "Battle",
          duration: "30",
        },
        {
          name: "Lose for money",
          duration: "10",
        },
      ]),
    },
    {
      id: "3",
      schedule: "Music to study to",
      schedule_url: "music-to-study-to",
      time_open: "0700",
      time_closed: "2000",
      services: JSON.stringify([
        {
          name: "Jazz",
          duration: "100",
        },
        {
          name: "Soul",
          duration: "50",
        },
        {
          name: "Hip-Hop",
          duration: "30",
        },
      ]),
    },
  ];
}

function makeMaliciousThing() {
  const maliciousThing = {
    id: 911,
    date_created: new Date().toISOString(),
    schedule: 'Naughty naughty very naughty <script>alert("xss");</script>',
    time_open: "0900",
    time_closed: "1700",
    services: JSON.stringify([
      {
        name: "Malicious <bold>Schedule</bold>",
        duration: "<script>console.log('xss')</script>60",
      },
    ]),
  };
  const expectedThing = {
    id: 911,
    image: "http://placehold.it/500x500",
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };

  return {
    maliciousThing,
    expectedThing,
  };
}

function seedSchedules(db, schedules) {
  return db
    .into("timespace_schedules")
    .insert(schedules)
    .then(() =>
      db.raw(`SELECT setval('timespace_schedules_id_seq', ?)`, [
        schedules[schedules.length - 1].id,
      ])
    );
}
function cleanTables(db) {
  return db.raw(
    `TRUNCATE 
      timespace_schedules
      RESTART IDENTITY CASCADE`
  );
}

module.exports = {
  makeSchedulesArray,
  makeMaliciousThing,
  cleanTables,
  seedSchedules,
};
