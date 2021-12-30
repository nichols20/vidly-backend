/* Creating a folder to work as the backend for the vidly application */

//import express to create web server
const express = require("express");
require("express-async-errors");

//assign the created application to the app object
const app = express();

require("winston-mongodb");
const config = require("config");
const mongoose = require("mongoose");

// Imported Route Handlers and Middleware
const home = require("./routes/home");
const auth = require("./routes/auth");
const users = require("./routes/users");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const error = require("./middleware/error");
const rentals = require("./routes/rentals");
const customers = require("./routes/customers");
const uncaughtError = require("./middleware/uncaughtException");

//In the event of an uncaught Exception the following listener will capture the exception and store it in mongodb
process.on("uncaughtException", (ex) => {
  console.log("UNCAUGHT EXCEPTION ERROR");

  uncaughtError(ex);
});

if (!config.get("jwtprivatekey")) {
  console.error("FATAL ERROR: jwtprivatekey is not defined ");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to vidly backend"))
  .catch((error) => console.error(`could not connect to mongodb ${error}`));

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
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

//Create a port object that will equal environemntal variabled if undefined set to 3000
const port = process.env.PORT || 3000;

//wrote listen function to create server
app.listen(port, () => {
  console.log(`listening in port ${port}`);
});

/* Each middleware function should be in it's own seperate file or module*/
