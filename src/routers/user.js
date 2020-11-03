const express = require("express");
const { reset } = require("nodemon");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");
/*
 * Create a user(Signup)
 */
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    //Everything will run after user.save function finish
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

/*
 * Login User
 */
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    //Create token for user
    const token = await user.generateAuthToken();
    console.log(user);
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    // once user logout delete only used token. If he has 3 session for different platform , we dont want to delete all token.
    // when he logout from android device.
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
/*
 * Get All Users Info
 * auth is middleware function
 */
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// Get User by ID
router.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: "There is no user with this ID" });
    } else res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
/*
 * Update User Information
 */
router.patch("/users/:id", async (req, res) => {
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
    const user = await User.findById(id);

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!user) {
      return res.status(404).send({ error: "There is no user with this ID" });
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/*
 * Delete user
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send({ error: "There is no user with this ID" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
