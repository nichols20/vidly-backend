const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const { Genre, validate } = require("../models/genres");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");

//Establishing the genres url path

router.get(
  "",
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.find().sort("asc");
    res.send(genre);
  })
);

router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res.status(404).send("The genre queried could not be found ");

    res.send(genre);
  })
);

router.post(
  "",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //create new genre object then attribute requested name to objects name value
    const genre = new Genre({
      name: req.body.name,
    });

    //attempt to save genre in database, display result of save method
    const result = await genre.save();

    //return new genres object to user
    res.send(result);
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //find genre user wishes to update
    const genre = await Genre.findById(req.params.id).catch(() => {
      return;
    });

    if (!genre) return res.status(404).send("Genre could not be found");
    else {
      genre.name = req.body.name;

      const result = await genre.save();
      res.send(result);
      return;
    }
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    await Genre.deleteOne({ _id: req.params.id });
    res.send("Genre selected has been deleted");
  })
);

module.exports = router;
