const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  res.status(401).send("Unauthorized user");
});

module.exports = router;
