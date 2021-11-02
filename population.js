const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

//only properties in model will be saved in the database
const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  //for the first argument in the populate method you define the object you want to populate
  //For the second argument if there are multiple properties in the referenced object
  //you can define which specific properties you want to be populated along side the author object
  // you can also append a - to exclude a property
  const courses = await Course.find()
    .populate("author", "name -_id")
    .select("name");
  console.log(courses);
}

//createAuthor('Mosh', 'My bio', 'My Website');

//createCourse("Node Course", "617760ae21a9ff046f51f25e");

listCourses();
