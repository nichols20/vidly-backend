const uncaughtError = require("../middleware/uncaughtException");

//In the event of an uncaught Exception the following listener will capture the exception and store it in mongodb
module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log("UNCAUGHT EXCEPTION ERROR");
    uncaughtError(ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    console.log("UNHANDLED REJECTION");
    uncaughtError(ex);
    process.exit(1);
  });
};
