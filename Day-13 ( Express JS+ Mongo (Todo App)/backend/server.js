//import express
const express = require("express");
//import mongodb
const mongodb = require("mongodb");
//import cors
const cors = require("cors");
//import body-parser
const bodyParser = require("body-parser");

//create server in express
const app = express();

//use middlewares
app.use(cors());
app.use(bodyParser.json());

//database url
const dbUrl = "mongodb://127.0.0.1:27017/todoDataBaseProject";

//connect to database url or mongodb
mongodb.MongoClient.connect(
  dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, client) => {
    if (err) {
      return console.log(err);
    }
    console.log("connected to mongoDb");
  }
);
//run server
app.listen(8081, () => {
  console.log("server started");
});
