const winston = require("winston");
const { createLogger, format } = require("winston");
const { combine, errors, metadata, timestamp } = format;

module.exports = function (err, req, res, next) {
  const logger = createLogger({
    level: "error",
    format: combine(
      errors({ stack: true }), // stores error stack
      timestamp(),
      metadata() //Sends error object to the meta field
    ),
    transports: [
      new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly",
        options: { useUnifiedTopology: true },
      }),

      new winston.transports.File({
        filename: "logfile.log",
        format: combine(format.json()), //stores error in json format
      }),
    ],
  });

  logger.error(err);

  return res.status(500).send("Something failed.");
};

// error- Most important level
// warn
// info
// verbose
// debug
// silly
