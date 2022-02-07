const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const { Genre, validate } = require("../models/genres");

//Establishing the genres url path
router.get(
  "",
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.find().sort("asc");
    res.send(genre);
  })
);

router.post(
  "",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(error.details[0].message);

    //create new genre object then attribute requested name to objects name value
    const genre = new Genre({
      name: req.body.name,
    });

    //attempt to save genre in database, display result of save method
    const result = await genre.save();

    //return new genres object to user
    res.send(req.body);
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(error.details[0].message);

    //find genre user wishes to update
    const genre = await Genre.findById(req.params.id).catch((error) =>
      console.log(error)
    );

    /* more validation required that I will get back to later */
    //change old genre name to the new name user requested
    genre.name = req.body.name;

    const result = await genre.save();
    res.send(result);
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
