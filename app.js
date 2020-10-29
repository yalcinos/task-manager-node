const express = require("express");
const moongose = require("mongoose");
const app = express();
const router = express.Router();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// moongose.Promise = global.Promise;
// app.use(morgan("dev"));
// app.use(bodyParser.urlencoded({ extended: false }));

//Extract json data
// app.use(bodyParser.json());

app.use((res, req, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
