const { createLogger } = require("winston");
const winston = require("winston");

module.exports = function (err, req, res, next) {
  //The first argument you need to set the logging level. This determines the importance of the message we're going to log

  winston.error(err.message, err);

  console.log("winston sucks", err);

  // error- Most important level
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something failed.");
};
