const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    //Everything will run after user.save function finish
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//POST request for tasks
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
//Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
  //   User.find({})
  //     .then((tasks) => {
  //       res.status(200).send(tasks);
  //     })
  //     .catch((err) => {
  //       res.status(500).send(err);
  //     });
});

// Get User by ID
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send();
    } else res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get all Tasks
app.get("/tasks", async (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.status(200).send(tasks);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get Task by ID
app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send();
    } else res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000);
