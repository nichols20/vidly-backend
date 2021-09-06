/* Creating a folder to work as the backend for the vidly application */

//import express to create web server
const express = require("express");
//assign the created application to the app object
const app = express();
//Create a port object that will equal environemntal variabled if undefined set to 3000
const port = process.env.PORT || 3000;
//.get function for root path
app.get("/", (req, res) => {
  res.send("hello world");
});
//wrote listen function to create server
app.listen(port, () => {
  console.log(`listening in port ${port}`);
});
