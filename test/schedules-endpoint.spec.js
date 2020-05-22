const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Schedules Endpoints", function () {
  let db;

  const { testUsers, testSchedules } = helpers.makeTimeSpaceFixtures();

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

  describe(`GET /api/schedules`, () => {
    context(`Given no schedules`, () => {
      before("insert users", () => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and empty list`, () => {
        return supertest(app)
          .get("/api/schedules")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context("Given there are schedules", () => {
      beforeEach("insert schedules", () =>
        helpers.seedSchedules(db, testSchedules)
      );
      before("insert users", () => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and all schedules`, () => {
        const expectedSchedules = testSchedules.map((schedule) =>
          helpers.makeExpectedSchedule(schedule)
        );
        return supertest(app)
          .get("/api/schedules")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedSchedules);
      });
    });
  });

  describe("POST /api/schedules", () => {
    before("insert users", () => helpers.seedUsers(db, testUsers));

    it(`creates a schedule, responsing with a 201 and new schedule`, function () {
      const testSchedule = {
        schedule: "Test new schedule",
        schedule_url: "test-new-schedule",
        time_open: "0700",
        time_closed: "1800",
        services: JSON.stringify([
          {
            name: "Test 1",
            duration: "60",
          },
          {
            name: "Test 2",
            duration: "45",
          },
          {
            name: "Test 3",
            duration: "30",
          },
        ]),
      };

      return supertest(app)
        .post("/api/schedules/")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(testSchedule)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property("id");
          expect(res.body.schedule).to.eql(testSchedule.schedule);
          expect(res.body.time_open).to.eql(testSchedule.time_open);
          expect(res.body.time_closed).to.eql(testSchedule.time_closed);
          expect(res.body.services).to.eql(testSchedule.services);
        });
    });
  });

  describe("GET /api/schedules/:schedule_id", () => {
    context("Given no schedules", () => {
      beforeEach(() => helpers.seedSchedules(db, testSchedules));
      before("insert users", () => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const fakeSchedule = 11111;
        return supertest(app)
          .get(`/api/schedules/${fakeSchedule}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Schedule doesn't exist` } });
      });
    });

    context("Given there are schedules in db", () => {
      beforeEach(() => helpers.seedSchedules(db, testSchedules));
      before("insert users", () => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and specified schedule`, () => {
        const scheduleId = 1;
        const expectedSchedule = {
          id: 1,
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
          date_created: new Date("2029-01-22T16:28:32.615Z").toISOString(),
          user_id: 1,
        };

        return supertest(app)
          .get(`/api/schedules/${scheduleId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedSchedule);
      });
    });

    context(`Given an XSS schedule attack`, () => {
      before("insert users", () => helpers.seedUsers(db, testUsers));

      const testUser = {
        id: 10,
        name: "Test Name",
        email: "test@email.com",
        password: "testpass",
        date_created: new Date("2029-01-22T16:28:32.615Z"),
      };
      const {
        maliciousSchedule,
        expectedSchedule,
      } = helpers.makeMaliciousSchedule(testUser);

      beforeEach("insert malicious schedule", () => {
        return helpers.seedMaliciousSchedule(db, testUser, maliciousSchedule);
      });
      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/schedules/${maliciousSchedule.id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.schedule).to.eql(expectedSchedule.schedule);
            expect(res.body.services).to.eql(expectedSchedule.services);
          });
      });
    });
  });
});
