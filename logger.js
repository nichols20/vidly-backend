//The next argument is a reference to the next middleware function in the pipeline
function log(req, res, next) {
  console.log("logging");

  //if there is no next function in a custome middleware function the server will be stuck
  //inside this current function similar to how you would need to terminate a loop function you need
  //to make sure you are terminating a middleware function either with next or sending a res to the client
  next();
}

//Instead of applying this function as the argument of app.use() we extracted the middleware function
//to a seperate module and will be exporting it as a method.

module.exports = log;
