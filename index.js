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

//Create a port object that will equal environemntal variabled if undefined set to 3000
const port = process.env.PORT || 3000;

//wrote listen function to create server
app.listen(port, () => {
  console.log(`listening in port ${port}`);
});

/* Each middleware function should be in it's own seperate file or module*/
