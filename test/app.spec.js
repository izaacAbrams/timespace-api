const app = require("../src/app");

describe("App", () => {
  it('GET /api/ responds with 200 containing ok"', () => {
    return supertest(app)
      .get("/api/")
      .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
      .expect(200, { ok: true });
  });
  it("GET /api/ responds 401 when incorrect token", () => {
    return supertest(app)
      .get("/api/")
      .expect(401, { error: "Unauthorized request" });
  });
});
