const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    const token = new User().generateAuthToken();

    //before testing a function that uses the req, res, next route handlers
    //we need to manually define these objects in the test suite since express isn't being used

    //define req.header as required by the auth middleware func
    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};

    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toBeDefined();
  });
});
