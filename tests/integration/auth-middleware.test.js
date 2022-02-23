let server;
let token;
const request = require("supertest");
const { User } = require("../../models/users");

describe("auth-Middleware", () => {
  beforeEach(() => {
    //initialize server
    server = require("../../index");
  });

  afterEach(async () => {
    //close server
    server.close();
  });

  const execute = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    const response = await execute();

    expect(response.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const response = await execute();

    expect(response.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    token = new User().generateAuthToken();
    const response = await execute();

    expect(response.status).toBe(200);
  });
});
