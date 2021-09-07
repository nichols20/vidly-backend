/* Creating a folder to work as the backend for the vidly application */

//import express to create web server
const express = require("express");
const logger = require("./logger");
const Joi = require("joi");
//assign the created application to the app object
const app = express();

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

app.use(function (req, res, next) {
  console.log("authenticating");
  next();
});

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
  //Validating if the property requested passes the Joi schema before adding it to the database
  const { error } = validateGenres(req.body);
  if (error) return res.send(error.details[0].message);
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

app.put("/vidly.com/api/genres/:id", (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.send(error.details[0].message);
  //Check to see if genre id user is searching for exists
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  //Check to see if the updated genre equals an existing genre name
  const duplicateGenre = genres.find(
    (g) => g.genre.toLowerCase() === req.body.genre.toLowerCase()
  );
  //If genre doesn't exist return error message and set not found res status
  if (!genre)
    return res.status(404).send("The genre You're looking for doesn't exist");

  if (duplicateGenre)
    return res.status(400).send("Can't rename genre to an existing genre");

  //If the genre searched exists we'll allow the user to update the genre name
  const index = genres.indexOf(genre);
  genres[index].genre = req.body.genre;

  res.send(genres);
});

app.delete("/vidly.com/api/genres/:id", (req, res) => {
  //Check to see if object id exists or has already been deleted
  const genre = genres.find((g) => g.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send(`The genre searched doesn't exist `);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genres);
});

function validateGenres(genre) {
  const schema = Joi.object({
    genre: Joi.string().required().min(3),
  });

  return schema.validate(genre);
}

/* Each middleware function should be in it's own seperate file or module*/
