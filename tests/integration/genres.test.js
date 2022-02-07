//When Writting integration tests I should initialize a server before each
//test then close the server after each test.
const request = require("supertest");
let server;

describe("/api/genres", () => {
  //Before/After each are utility functions to initiate a callback before and after
  //each test. This is a method I can use to open and close the server

  beforeEach(() => {
    //initialize server
    server = require("../../index");
  });

  afterEach(() => {
    //close server
    server.close();
  });

  describe("GET", () => {
    it("should return all genres", async () => {
      const response = await request(server).get("/api/genres");
      expect(response.status).toBe(200);
    });
  });
});
