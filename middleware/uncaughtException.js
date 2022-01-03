require("winston-mongodb");
const winston = require("winston");
const { createLogger, format } = require("winston");
const { combine, errors, metadata, timestamp } = format;

module.exports = function (err) {
  const logger = createLogger({
    level: "error",
    format: combine(errors({ stack: true }), timestamp(), metadata()),
    transports: [
      new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly",
        options: { useUnifiedTopology: true },
      }),

      new winston.transports.File({
        filename: "logfile.log",
        format: combine(format.json()),
      }),
    ],
  });

  logger.error(err);
};
