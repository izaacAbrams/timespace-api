const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      user_id: "1",
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
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      user_id: "1",
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
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      user_id: "1",
    },
  ];
}

function makeUsersArray() {
  return [
    {
      id: 1,
      name: "Test Name",
      email: "test@email.com",
      password: "$2a$04$TwLEtStd0FKh2c1aVwhiOuTRmK7xayo8i.vFIyPb/TuEgfOF4ub0a",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      name: "Test Two",
      email: "test2@email.com",
      password: "$2a$04$TwLEtStd0FKh2c1aVwhiOuTRmK7xayo8i.vFIyPb/TuEgfOF4ub0a",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      name: "Test Three",
      email: "test3@email.com",
      password: "$2a$04$TwLEtStd0FKh2c1aVwhiOuTRmK7xayo8i.vFIyPb/TuEgfOF4ub0a",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}
function makeAppointmentsArray() {
  return [
    {
      id: 1,
      name: "Test Smith",
      email: "test@google.com",
      schedule: 1,
      service: "Nails",
      appt_date_time: "2020-05-08T16:00:00.000Z",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      name: "Joe Smith",
      email: "test@google.com",
      schedule: 1,
      service: "Nails",
      appt_date_time: "2020-05-08T16:00:00.000Z",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      name: "John Smith",
      email: "test@google.com",
      schedule: 1,
      service: "Nails",
      appt_date_time: "2020-05-08T16:00:00.000Z",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeExpectedAppt(appt) {
  return {
    id: appt.id,
    name: appt.name,
    appt_date_time: appt.appt_date_time,
    service: appt.service,
    schedule: 1,
    date_created: new Date("2029-01-22T16:28:32.615Z").toISOString(),
    email: appt.email,
  };
}

function makeExpectedSchedule(schedule) {
  return {
    id: parseInt(schedule.id),
    schedule: schedule.schedule,
    schedule_url: schedule.schedule_url,
    time_open: schedule.time_open,
    time_closed: schedule.time_closed,
    services: schedule.services,
    user_id: 1,
    date_created: new Date("2029-01-22T16:28:32.615Z").toISOString(),
  };
}

function makeMaliciousSchedule() {
  const maliciousSchedule = {
    id: 911,
    date_created: new Date().toISOString(),
    schedule: 'Naughty naughty very naughty <script>alert("xss");</script>',
    schedule_url: "naught-xss-attack",
    time_open: "0900",
    time_closed: "1700",
    services: JSON.stringify([
      {
        name: "Malicious <bold>Schedule</bold>",
        duration: "<script>console.log('xss')</script>60",
      },
    ]),
  };

  const expectedSchedule = {
    id: 911,
    date_created: new Date().toISOString(),
    schedule:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    services: `[{"name":"Malicious &lt;bold&gt;Schedule&lt;/bold&gt;","duration":"&lt;script&gt;console.log('xss')&lt;/script&gt;60"}]`,
  };

  return {
    maliciousSchedule,
    expectedSchedule,
  };
}

function seedMaliciousSchedule(db, user, schedule) {
  return seedUsers(db, [user]).then(() =>
    db.into("timespace_schedules").insert([schedule])
  );
}

function makeMaliciousAppointment() {
  const maliciousAppt = {
    id: 911,
    date_created: new Date().toISOString(),
    schedule: 1,
    name: "<bold>xss attack</bold>",
    email: "<bad>email</bad>",
    service: "<script>service</script>",
    appt_date_time: "2020-05-08T16:00:00.000Z",
  };

  const expectedAppt = {
    id: 911,
    date_created: new Date().toISOString(),
    name: "&lt;bold&gt;xss attack&lt;/bold&gt;",
    appt_date_time: "2020-05-08T16:00:00.000Z",
    schedule: "1",
    service: "&lt;script&gt;service&lt;/script&gt;",
    email: "&lt;bad&gt;email&lt;/bad&gt;",
  };

  return {
    maliciousAppt,
    expectedAppt,
  };
}

function seedMaliciousSchedule(db, user, schedule) {
  return seedUsers(db, [user]).then(() =>
    db.into("timespace_schedules").insert([schedule])
  );
}

function seedMaliciousAppt(db, user, appt) {
  return seedUsers(db, [user]).then(() =>
    db.into("timespace_appointments").insert([appt])
  );
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

function seedAppointments(db, appts) {
  return db
    .into("timespace_appointments")
    .insert(appts)
    .then(() =>
      db.raw(`SELECT setval('timespace_appointments_id_seq', ?)`, [
        appts[appts.length - 1].id,
      ])
    );
}
function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("timespace_users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('timespace_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ])
    );
}

function makeTimeSpaceFixtures() {
  const testUsers = makeUsersArray();
  const testSchedules = makeSchedulesArray();
  const testAppointments = makeAppointmentsArray(testSchedules);
  return { testUsers, testSchedules, testAppointments };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE 
      timespace_schedules,
      timespace_appointments,
      timespace_users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE timespace_schedules_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE timespace_users_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE timespace_appointments_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('timespace_schedules_id_seq', 0)`),
          trx.raw(`SELECT setval('timespace_users_id_seq', 0)`),
          trx.raw(`SELECT setval('timespace_appointments_id_seq', 0)`),
        ])
      )
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeSchedulesArray,
  makeUsersArray,
  makeAppointmentsArray,
  makeMaliciousSchedule,
  makeMaliciousAppointment,
  makeTimeSpaceFixtures,
  makeExpectedAppt,
  makeExpectedSchedule,
  makeAuthHeader,
  cleanTables,
  seedSchedules,
  seedAppointments,
  seedMaliciousSchedule,
  seedMaliciousAppt,
  seedUsers,
};
