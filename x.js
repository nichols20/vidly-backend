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

//Authentication the process of identifying if the user is who they are

//Authorization is determining if the user has the required permission to perform operations
//that modify data

//Register: Post /api/users {name, email, password}

/*
email: {
  type: String, 
  unique: true //this is to insure we don't store two documents with the same email in mongodb
} 
*/

//The crud operation you'd use would be a POST because you're creating a new
//Login:  POST /api/logins --

// Information Expert Principle

// 400: Bad Request Error
// 401: Client has the possibility of authorization to access the resource but has not sent a valid jsonwebtoken to the server
// 403: FORBIDDEN - Response when client sends a valid jsonwebtoken yet still doesn't have the required permission to access the requested resource
// 404: Not Found
