//When Writting integration tests I should initialize a server before each
//test then close the server after each test.
const request = require("supertest");
const { Genre, validate } = require("../../models/genres");
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
    await Genre.remove({});
  });

  describe("GET", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const response = await request(server).get("/api/genres");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });
});

//Write tests in a clean state- as if its the only test we've created.
