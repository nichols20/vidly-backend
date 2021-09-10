const express = require("express");
const router = express.Router();

//.get function for root path
router.get("", (req, res) => {
  res.send("hello world");
});

module.exports = router;
