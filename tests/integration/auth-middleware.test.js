let server;
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/users");

describe("auth-Middleware", () => {
  let token = new User().generateAuthToken();

  beforeEach(() => {
    //initialize server
    server = require("../../index");
  });

  afterEach(async () => {
    //close server
    server.close();
    //ran into an error where mongoose would try to log after the server has been closed
    //don't know why this happened but I solved this error by closing the mongoose connecton manually
    await mongoose.connection.close();
  });

  const execute = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send();
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    const response = await execute();

    expect(response.status).toBe(401);
  });
});
