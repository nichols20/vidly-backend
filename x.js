//Trade off between query performance vs consistency

//Using references (Normalization) -> CONSISTENCY
//loads properties in two querys
//to change the value of an author there is one single reference you need to
//change and then all courses referencing said object will be updated

let author = {
  name: 'mosh"',
};

let course = {
  author: "id",
};

// Using embedded Documents (Denormalization) -> PERFORMANCE
//Loads properties in a single query
//to change the value of an author object you will need to change said
//object in each course object referencing said author
let course = {
  author: {
    name: "",
  },
};

//Hybrid
//useful for snapshots of data at a certain time
let author = {
  name: "mosh",
  //50 other peroperties
};

let course = {
  author: {
    id: "reference to author doc",
    name: "mosh",
  },
};
