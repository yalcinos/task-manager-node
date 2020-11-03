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
 * Get All tasks for a specific user
 */
router.get("/tasks", auth, async (req, res) => {
  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate("tasks").execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
  // Task.find({ owner: req.user._id })
  //   .then((tasks) => {
  //     res.status(200).send(tasks);
  //   })
  //   .catch((err) => {
  //     res.status(500).send(err);
  //   });
});

/*
 * Get Task By Id
 */
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "There is no task with this ID" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
 * Update Task
 */
router.patch("/tasks/:id", auth, async (req, res) => {
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
    //const task = await Task.findById(id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Can't authorized!" });
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

/*
 * Delete task
 */
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    //const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      res.status(404).send({
        error: "Can't find task or Can't authorized for deleting the task",
      });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
