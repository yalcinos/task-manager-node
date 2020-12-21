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
 * Get /tasks?limit:10&skip:20 => get 2th page.
 * Get /tasks?sortBy=createdAt:asc
 */
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  //Get all task which is done!
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortedBy) {
    const parts = req.query.sortedBy.split(":");
    // 1 is acsending, -1 is descanding
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
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
    const task = await Task.findOne({
      _id: id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Can't not find it!" });
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
