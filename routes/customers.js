const express = requirw("express");
const router = express.router();
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  isGold: Boolean,
  name: String,
  phone: String,
});

module.exports = router;
