/* Creating a folder to work as the backend for the vidly application */

//import express to create web server
const config = require("config");
const express = require("express");
const app = express();
//Route Handlers & Middleware
require("express-async-errors");
require("./startup/db")();
require("./startup/routes")(app);
const uncaughtError = require("./middleware/uncaughtException");

//In the event of an uncaught Exception the following listener will capture the exception and store it in mongodb
process.on("uncaughtException", (ex) => {
  console.log("UNCAUGHT EXCEPTION ERROR");
  uncaughtError(ex);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  console.log("UNHANDLED REJECTION");
  uncaughtError(ex);
  process.exit(1);
});

if (!config.get("jwtprivatekey")) {
  console.error("FATAL ERROR: jwtprivatekey is not defined ");
  process.exit(1);
}

//Create a port object that will equal environemntal variabled if undefined set to 3000
const port = process.env.PORT || 3000;

//wrote listen function to create server
app.listen(port, () => {
  console.log(`listening in port ${port}`);
});

/* Each middleware function should be in it's own seperate file or module*/
