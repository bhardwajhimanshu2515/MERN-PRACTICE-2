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
    const newDb = client.db("todoDataBaseProject");
    //api create here

    //signup api create
    app.post("/signup", (req, res) => {
      console.log(req.body);
      const { name, phoneNumber, email, password } = req.body;

      //check if user already exist or not
      let existingUser = newDb
        .collection("user")
        .find({ email: email })
        .toArray();
      existingUser.then((User) => {
        //if user already exist
        if (User.length > 0) {
          return res.status(201).json("User Already Exist");
        }
        //if user does not exist
        else if (User.length < 1) {
          let createUser = newDb.collection("user").insertOne({
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            password: password,
          });
          createUser.then((User) => {
            res.status(200).json(User.ops);
          });
        }
      });
    });

    //login api
    app.post("/login", (req, res) => {
      console.log(req.body);
      const { email, password } = req.body;

      //check user exist or not
      let existingUser = newDb
        .collection("user")
        .find({ email: email })
        .toArray();
      existingUser.then((User) => {
        //if user not exist
        if (User.length < 1) {
          return res
            .status(201)
            .json("User does not exist, please signup Instead ");
        }
        //if user exist
        else if (User.length > 0) {
          //if pass match
          if (password === User[0].password) {
            return res.status(200).json(User);
          }
          //if pass not match
          else {
            res.status(201).json("Password Didn't match");
          }
        }
      });
    });

    //api for create todo
    app.post("/createTodo", (req, res) => {
      console.log(req.body);
      const { title, description, deadline, userId } = req.body;

      let createdTodo = newDb
        .collection("todo")
        .insertOne({
          title: title,
          description: description,
          deadline: deadline,
          userId: userId,
        });
      createdTodo
        .then((Todo) => {
          console.log(Todo);
          return res.status(200).json(Todo.ops[0]);
        })
        .catch((err) => {
          return res.status(500).json("Error in saving Todo");
        });
    });

    //get todo
    app.get("/getTodo/:userId", (req, res) => {
      console.log(req.params.userId);

      //get all todo for user which loggedIn
      let allTodo = newDb
        .collection("todo")
        .find({ userId: req.params.userId })
        .toArray();
      allTodo
        .then((Todo) => {
          console.log(Todo);
          return res.status(200).json(Todo);
        })
        .catch((err) => {
          return res.status(500).json("Error in getting todo");
        });
    });

    //delete todo
    app.delete("/deleteTodo/:userId/:todoId", (req, res) => {
      console.log(req.params.todoId);

      let deleteTodo = newDb
        .collection("todo")
        .deleteOne({ _id: new mongodb.ObjectId(req.params.todoId) });
      deleteTodo.then((Todo) => {
        console.log(Todo);
        //get all todo for user which loggedIn
        let allTodo = newDb
          .collection("todo")
          .find({ userId:req.params.userId })
          .toArray();
        allTodo
          .then((Todo) => {
            console.log(Todo);
            return res.status(200).json(Todo);
          })
          .catch((err) => {
            return res.status(500).json("Error in getting todo");
          });
      });
    });

    //api for updation of todo
    app.patch("/updateTodo",(req,res)=>{
      console.log(req.body);
      let updateTodo=newDb.collection('todo').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.todoId)},
      {
        $set:{
          title:req.body.title,
          description:req.body.description,
          deadline:req.body.deadline
        }
      },{new: true,runValidators:true,returnOriginal:false})
      updateTodo.then(Todo=>{
        console.log(Todo);
        let allTodo = newDb
          .collection("todo")
          .find({ userId:req.body.userId })
          .toArray();
        allTodo
          .then((Todo) => {
            console.log(Todo);
            return res.status(200).json(Todo);
          })
          .catch((err) => {
            return res.status(500).json("Error in getting todo");
          });
      })
    })
  }
);
//run server
app.listen(8081, () => {
  console.log("server started");
});
