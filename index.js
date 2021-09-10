/* Creating a folder to work as the backend for the vidly application */

//import express to create web server
const express = require("express");
//assign the created application to the app object
const app = express();
const home = require("./routes/home");
const genres = require("./routes/genres");
const logger = require("./middleware/logger");

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

//The extracted logger middlelware function is atrributed to the logger object we then call
//said method inside of app.use()
app.use(logger);

app.use("/", home);
app.use("/api/genres", genres);

app.use(function (req, res, next) {
  console.log("authenticating");
  next();
});

//Create a port object that will equal environemntal variabled if undefined set to 3000
const port = process.env.PORT || 3000;

//wrote listen function to create server
app.listen(port, () => {
  console.log(`listening in port ${port}`);
});

/* Each middleware function should be in it's own seperate file or module*/
