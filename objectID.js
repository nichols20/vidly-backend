//ObjectId is a 24 character object

//each two characters = one byte there are 12 bytes in an ObjectID

//The first 4 Bytes represent a Timestamp

//The next 3 Bytes represent the machine identifier

//the next 2 Bytes represent the process identifier

//The last 3 Bytes represent a counter

const mongoose = require("mongoose");

const id = new mongoose.Types.ObjectId();

console.log(id.getTimestamp());
