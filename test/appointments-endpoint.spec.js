const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Appointments Endpoints", function () {
  let db;

  const {
    testUsers,
    testAppointments,
    testSchedules,
  } = helpers.makeTimeSpaceFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnected from db", () => db.destroy());
  before("cleanup", () => helpers.cleanTables(db));
  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("POST /api/appointments", () => {
    before("insert users", () => helpers.seedUsers(db, testUsers));
    beforeEach("insert schedules", () =>
      helpers.seedSchedules(db, testSchedules)
    );

    it(`creates an appt, responsing with a 201 and new appt`, function () {
      const testAppt = {
        name: "Test Name",
        email: "test@google.com",
        schedule: "1",
        service: "Nails",
        appt_date_time: "2020-05-08T16:00:00.000Z",
      };

      return supertest(app)
        .post("/api/appointments")
        .send(testAppt)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property("id");
          expect(res.body.name).to.eql(testAppt.name);
          expect(res.body.email).to.eql(testAppt.email);
          expect(res.body.schedule).to.eql(testAppt.schedule);
          expect(res.body.appt_date_time).to.eql(testAppt.appt_date_time);
          expect(res.body.service).to.eql(testAppt.service);
        });
    });
  });

  describe("GET /api/appointments/:appointment_id", () => {
    context("Given no appointments", () => {
      before("insert users", () => helpers.seedUsers(db, testUsers));
      beforeEach("insert schedules", () =>
        helpers.seedSchedules(db, testSchedules)
      );
      beforeEach("insert appointments", () =>
        helpers.seedAppointments(db, testAppointments)
      );
      it(`responds with 404`, () => {
        const fakeAppt = 11111;
        return supertest(app)
          .get(`/api/appointments/${fakeAppt}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Appointment doesn't exist` } });
      });
    });

    context("Given there are appointments in db", () => {
      before("insert users", () => helpers.seedUsers(db, testUsers));
      beforeEach("insert schedules", () =>
        helpers.seedSchedules(db, testSchedules)
      );
      beforeEach("insert appointments", () =>
        helpers.seedAppointments(db, testAppointments)
      );

      it(`responds with 200 and specified appointment`, () => {
        const apptId = 1;
        const expectedAppt = {
          id: 1,
          name: "Test Smith",
          email: "test@google.com",
          schedule: "1",
          service: "Nails",
          appt_date_time: "2020-05-08T16:00:00.000Z",
          date_created: "2029-01-22T16:28:32.615Z",
        };

        return supertest(app)
          .get(`/api/appointments/${apptId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedAppt);
      });
    });

    context(`Given an XSS appt attack`, () => {
      before("insert users", () => helpers.seedUsers(db, testUsers));
      beforeEach("insert schedules", () =>
        helpers.seedSchedules(db, testSchedules)
      );
      const testUser = {
        id: 10,
        name: "Test Name",
        email: "test@email.com",
        password: "testpass",
        date_created: new Date("2029-01-22T16:28:32.615Z"),
      };
      const { maliciousAppt, expectedAppt } = helpers.makeMaliciousAppointment(
        testUser
      );

      beforeEach("insert malicious appt", () => {
        return helpers.seedMaliciousAppt(db, testUser, maliciousAppt);
      });
      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/appointments/${maliciousAppt.id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.name).to.eql(expectedAppt.name);
            expect(res.body.email).to.eql(expectedAppt.email);
            expect(res.body.schedule).to.eql(expectedAppt.schedule);
            expect(res.body.appt_date_time).to.eql(expectedAppt.appt_date_time);
            expect(res.body.service).to.eql(expectedAppt.service);
          });
      });
    });
  });
});
