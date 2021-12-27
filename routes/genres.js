const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Genre, validate } = require("../models/genres");

//Establishing the genres url path
router.get("", async (req, res) => {
  await Genre.find()
    .sort("asc")
    .then((result) => {
      res.send(result);
    });
});

router.post("", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  res.status(401);

  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);

  //create new genre object then attribute requested name to objects name value
  const genre = new Genre({
    name: req.body.name,
  });

  try {
    //attempt to save genre in database, display result of save method
    const result = await genre.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }

  //return new genres object to user
  res.send(req.body);
});

router.put("/:id", async (req, res) => {
  console.log("route method has begun");
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);

  console.log("update function began");
  //find genre user wishes to update
  const genre = await Genre.findById(req.params.id).catch((error) =>
    console.log(error)
  );
  console.log(genre);
  /* more validation required that I will get back to later
   */
  //change old genre name to the new name user requested
  genre.name = req.body.name;

  try {
    const result = await genre.save();
    res.send("Genre has been updated");
    console.log(result);
    return result;
  } catch (ex) {
    console.log(ex);
  }

  res.send("this is the route");
});

router.delete("/:id", async (req, res) => {
  await Genre.deleteOne({ _id: id })
    .then(res.send("Genre selected has been deleted"))
    .catch((error) => console.log(`delete method error ${error}`));
});

module.exports = router;
