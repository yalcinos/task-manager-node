const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

const multer = require("multer");
//Creates avatars folder.
const upload = multer({
  dest: "images",
  limits: {
    //1mb max.
    fileSize: 1000000,
  },
  fileFilter(req, file, calllback) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return calllback(new Error("Please upload a word document!"));
    }
    calllback(undefined, true);
  },
});

app.post(
  "/upload",
  upload.single("upload"),
  async (req, res) => {
    res.send(200);
  }, //After route handler run this function like callback
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port:" + port);
});
