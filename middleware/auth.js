const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied: No token provided");

  //The first argument is the token, the second argument is the secret or public key
  //The result of this method is a decoded payload
  try {
    const decoded = jwt.verify(token, config.get("jwtprivatekey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
};
