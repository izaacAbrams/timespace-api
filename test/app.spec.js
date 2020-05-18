const app = require("../src/app");

describe("App", () => {
  it("GET /api/ responds 401 when incorrect token", () => {
    return supertest(app)
      .get("/api/schedules")
      .expect(401, { error: "Missing bearer token" });
  });
});
