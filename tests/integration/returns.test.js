let server;
let movieId;
let movie;
let customerId;
let rental;
let token;
const { User } = require("../../models/users");
const { Rental } = require("../../models/rentals");
const { Movie } = require("../../models/movies");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/returns", () => {
  beforeEach(async () => {
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    server = require("../../index");

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });

    await movie.save();

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
      dailyRentalRate: 2,
      numberInStock: 2,
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
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

  it("should return 400 if return rental is already processed", async () => {
    rental.dateReturned = Date.now();
    await rental.save();

    const response = await execute(server, customerId, movieId, token);

    expect(response.status).toBe(400);
  });

  it("should return 200 if request is valid", async () => {
    const response = await execute(server, customerId, movieId, token);

    expect(response.status).toBe(200);
  });

  it("should set the return date if input is valid", async () => {
    await execute(server, customerId, movieId, token);

    const rentalReturned = await Rental.findById(rental._id);

    expect(rentalReturned.dateReturned).toBeDefined();
  });

  it("should calculate a rental fee based on (# of days * movie.dailyRentalRate)", async () => {
    await execute(server, customerId, movieId, token);

    const rentalReturned = await Rental.findById(rental._id);

    expect(rentalReturned.rentalFee).toBeGreaterThanOrEqual(
      rentalReturned.dailyRentalRate
    );
  });

  it("Should increase the movie Stock if input is valid", async () => {
    await execute(server, customerId, movieId, token);

    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});
