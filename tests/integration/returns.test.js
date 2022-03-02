let server;
let movieId;
let customerId;
let rental;
const { Rental } = require("../../models/rentals");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/returns", () => {
  beforeEach(async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    server = require("../../index");

    rental = new Rental({
      customer: {
        name: "12345",
        phone: "12345",
        _id: customerId,
      },
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

  it("should return 401 if client is not logged in", async () => {
    const result = await request(server)
      .post("/api/returns")
      .send({ customerID: customerId, movieId: movieId });

    expect(result.status).toBe(401);
  });
});
