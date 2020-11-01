const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const { reset } = require("nodemon");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/*
 * Create a user
 */
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

/*
 * Get All Users Info
 */
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

/*
 * Update User Information
 */
app.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdatesField = ["name", "email", "password", "age"];
  //Check if the body of request is same as the field that we decided.
  const isValidOperation = updates.every((update) => {
    return allowedUpdatesField.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    //new:true will return the modified user.
    //Validate the type of body is same as modal.
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
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

/*
 * Create Task
 */
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

/*
 * Get All tasks
 */
app.get("/tasks", async (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.status(200).send(tasks);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

/*
 * Get Task By Id
 */
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

/*
 * Update Task
 */
app.patch("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdatesField = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdatesField.includes(update);
  });
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.listen(3000);
