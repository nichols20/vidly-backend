const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid json web token", () => {
    const userParams = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
    const user = new User(userParams);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtprivatekey"));
    expect(decoded).toMatchObject(userParams);
  });
});
