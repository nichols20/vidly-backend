const { User } = require("../../../models/users");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();

    //before testing a function that uses the req, res, next route handlers
    //we need to manually define these objects in the test suite since express isn't being used

    //define req.header as required by the auth middleware func
    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};

    const next = jest.fn();

    auth(req, res, next);

    expect(req.user.isAdmin).toBeTruthy();
    //when expecting req.user._id to be user._id an error "serializes to same string" occured this is because
    //even though we defined _id as an objectId the decoded payload converts the ID to be a string so to solve this error
    //I chained the toHexString() method after generating an objectID so both properties can be compared
    expect(req.user._id).toBe(user._id);
  });
});
