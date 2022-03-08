let server;
let movieId;
let customerId;
let rental;
let token;
const { User } = require("../../models/users");
const { Rental } = require("../../models/rentals");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/returns", () => {
  beforeEach(async () => {
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    server = require("../../index");

    rental = new Rental({
      customer: {
        name: "12345",
        phone: "12345",
        _id: customerId,
      },
      customerId: customerId,
      movieId: movieId,
      movie: {
        _id: movieId,
        title: "12345",
      },
      dailyRentalRate: 5,
      numberInStock: 2,
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
  });

  const execute = async (server, customerId, movieId, token) => {
    const response = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });

    return response;
  };

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const response = await execute(server, customerId, movieId, token);

    expect(response.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const response = await execute(server, customerId, movieId, token);
    expect(response.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const response = await execute(server, customerId, movieId, token);

    expect(response.status).toBe(400);
  });

  it("should return 404 if no rental found for customer/movie", async () => {
    movieId = "111111111";
    const response = await execute(server, customerId, movieId, token);

    expect(response.status).toBe(404);
  });
});
