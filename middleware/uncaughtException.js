require("winston-mongodb");
const winston = require("winston");
const { createLogger, format } = require("winston");
const { combine, errors, metadata, timestamp } = format;

module.exports = function (err) {
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

  //logger.error not storing error stacks need to figure out why
  console.log(err);

  logger.error(err);
};
