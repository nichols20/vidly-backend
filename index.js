/* Creating a folder to work as the backend for the vidly application */

//import express to create web server
const express = require("express");
const app = express();

//Route Handlers & Middleware
require("./startup/uncaughtHandling")();
require("express-async-errors");
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/prod")(app);

//Create a port object that will equal environemntal variabled if undefined set to 3000
const port = process.env.PORT || 3000;

let server;

//When running jest all test suites are ran in parallel; as a result when there are multiple test suites that
//establish a connection to a server port an error occurs.
//to Solve this issue when the NODE_ENV is not in a test state the express app with begin listening in the defined port above
//like usual
if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

//However if the NODE_ENV does equal a test state our app isn't going to listen in a specified port what this does is it allows
//jest to initialize and close multiple servers for test suites to run in parallel.
if (process.env.NODE_ENV === "test") {
  server = app.listen(() => {
    console.log(`Listening on port ${port}`);
  });
}

module.exports = server;

/* Each middleware function should be in it's own seperate file or module*/
