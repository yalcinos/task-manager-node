const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
const auth = require("../middleware/auth");
/*
 * Create Task
 */
router.post("/tasks", auth, async (req, res) => {
  //const task = await new Task(req.body);
  const task = await new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

/*
 * Get All tasks
 */
router.get("/tasks", async (req, res) => {
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
router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send({ error: "There is no task with this ID" });
    } else res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
 * Update Task
 */
router.patch("/tasks/:id", async (req, res) => {
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
    const task = await Task.findById(id);
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    if (!task) {
      return res.status(404).send({ error: "There is no task with this ID" });
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

/*
 * Delete task
 */
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).send({ error: "There is no task with this ID" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
