const express = require("express");

// Imported Route Handlers and Middleware
const home = require("../routes/home");
const auth = require("../routes/auth");
const users = require("../routes/users");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const error = require("../middleware/error");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const customers = require("../routes/customers");

module.exports = function (app) {
  /*The express.json function returns a middleware function. which reads the request and
 if there is a json object in the body of the request it will then parse the body of the request
 into a json object */
  app.use(express.json());
  /*Similar to express.json urlencoded returns a middleware function that parses urlencoded payloads
 body-parser is now a deprecated constructor to be able to use the methods inside you need to call the methods
 explicitly then set the extended property to true inside the object of the methods argument */
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  /*express.static is used to serve static files. The first argument is the name of a folder  */
  app.use(express.static("public"));

  app.use("/", home);
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/returns", returns);
  app.use("/api/rentals", rentals);
  app.use("/api/customers", customers);
  app.use(error);
};
