const express = require("express");
const { reset } = require("nodemon");
const multer = require("multer");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");
const sharp = require("sharp");
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

/*
 * Logout from single session
 */
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
 * Logout from all sessions
 */
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
/*
 * Get User Info
 * auth is middleware function
 */
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

/*
 * Update User Information
 * /users/:id endpoint is not safe because user may update other user information if they know the user id.
 * Using /users/me instead.
 */
router.patch("/users/me", auth, async (req, res) => {
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
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/*
 * Delete user
 */
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Creates avatars folder.
const upload = multer({
  limits: {
    //1mb max.
    fileSize: 1000000,
  },
  fileFilter(req, file, calllback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return calllback(new Error("Please upload an image"));
    }
    calllback(undefined, true);
  },
});

//Add avatar photo
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  //After route handler run this function like callback
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//Read avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error("No Avatar messsage");
    }

    //set response header
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});
module.exports = router;
