//When Writting integration tests I should initialize a server before each
//test then close the server after each test.

const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");
let server;

describe("/api/genres", () => {
  //Before/After each are utility functions to initiate a callback before and after
  //each test. This is a method I can use to open and close the server

  beforeEach(() => {
    //initialize server
    server = require("../../index");
  });

  afterEach(async () => {
    //close server
    server.close();
    //cleanup genre collection
    await Genre.deleteMany({});
  });

  describe("GET", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const response = await request(server).get("/api/genres");

      expect(response.status).toBe(200);
      expect(response.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(response.body.some((g) => g.name === "genre2")).toBeTruthy();
    });

    it("Should return a genre for a given id", async () => {
      const _id = new mongoose.Types.ObjectId();

      await Genre.collection.insertOne({ _id: _id, name: "testGenre" });

      const response = await request(server).get(`/api/genres/${_id}`);

      console.log(response.error);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ _id: _id, name: "testGenre" });
    });

    it("should return a 404 error for bad get request", async () => {
      const response = await request(server).get(
        "/api/genres/909090909090909090900000"
      );

      expect(response.status).toBe(404);
    });
  });

  describe("POST", () => {
    const execute = async (server, data) => {
      const token = new User().generateAuthToken();

      const response = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token) //to simulate login auth we use the set() method; first argument is the header we're setting and the second arg will be the value of header name
        .send({ name: data });

      return response;
    };

    it("should return a 401 if client is not logged in", async () => {
      const response = await request(server)
        .post("/api/genres")
        .send({ name: "genre1" });

      expect(response.status).toBe(401);
    });

    it("should return 400 if genre is invalid", async () => {
      const response = await execute(server, "123");
      const res = await execute(server, new Array(52).join("a"));

      expect(response.status).toBe(400);
      expect(res.status).toBe(400);
    });

    it("should post new genre to the database", async () => {
      await execute(server, "Anime234");

      const genre = await Genre.find({ name: "Anime234" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const response = await execute(server, "Anime234");

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("name", "Anime234");
    });
  });
});

//Write tests in a clean state- as if its the only test we've created.
