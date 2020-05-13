const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Schedules Endpoints", function () {
  let db;

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

  describe("POST /api/schedules", () => {
    beforeEach("insert schedules", () => helpers.makeSchedulesArray());

    it(`creates a schedule, responsing with a 201 and new schedule`, function () {
      this.retries(3);
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
        .set("Authorization", "Bearer fd78e65a-123c-4521-bdd2-d286eb1b8b6d")
        .send(testSchedule)
        .expect(201)
        .expect((res) => {
          console.log(res.body);
          expect(res.body).to.have.property("id");
          expect(res.body.schedule).to.eql(testSchedule.schedule);
          expect(res.body.time_open).to.eql(testSchedule.time_open);
          expect(res.body.time_closed).to.eql(testSchedule.time_closed);
          expect(res.body.services).to.deep.eql(testSchedule.services);
        });
      // .expect((res) =>
      //   db
      //     .from("timespace_schedules")
      //     // .set("Authorization", "Bearer fd78e65a-123c-4521-bdd2-d286eb1b8b6d")
      //     .select("*")
      //     .where({ id: res.body.id })
      //     .first()
      //     .then((row) => {
      //       expect(row.body).to.have.property("id");
      //       expect(row.body.schedule).to.eql(testSchedule.schedule);
      //       expect(row.body.time_open).to.eql(testSchedule.time_open);
      //       expect(row.body.time_closed).to.eql(testSchedule.time_closed);
      //       expect(row.body.services).to.deep.eql(testSchedule.services);
      //     })
      // );
    });
  });
});
