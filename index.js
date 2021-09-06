/* Creating a folder to work as the backend for the vidly application */

//import express to create web server
const express = require("express");
//assign the created application to the app object
const app = express();

//Allows Json type text to be passed through the middleware
app.use(express.json());

//Create a port object that will equal environemntal variabled if undefined set to 3000
const port = process.env.PORT || 3000;

const genres = [
  { id: 1, genre: "Action" },
  { id: 2, genre: "Thriller" },
  { id: 3, genre: "Comedy" },
];

//wrote listen function to create server
app.listen(port, () => {
  console.log(`listening in port ${port}`);
});

//.get function for root path
app.get("/vidly.com", (req, res) => {
  res.send("hello world");
});

//Establishing the genres url path
app.get("/vidly.com/api/genres", (req, res) => {
  res.send(genres);
});

app.post("/vidly.com/api/genres", (req, res) => {
  //Look to see if post request genre already exists
  const duplicateGenre = genres.find(
    (g) => g.genre.toLowerCase() === req.body.genre.toLowerCase()
  );
  //If the genre exists send error message set bad request status
  if (duplicateGenre) return res.status(400).send(`genre already exists`);

  //If no duplicate genre exists push requested genre to genres object
  const genre = { id: genres.length + 1, genre: req.body.genre };
  genres.push(genre);

  //return new genres object to user
  res.send(genres);
});
