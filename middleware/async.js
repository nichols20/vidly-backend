//Create function that takes route handler function reference
module.exports = function asyncMiddleware(handler) {
  //return a route handler function to call the handler argument passed
  //The reason why we don't directly call the function is so that Express is able to do so. Otherwise we wouldn't be able to access the
  //req, res, and next objects.
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
