const moongose = require("mongoose");
const validator = require("validator");
require("dotenv").config();
moongose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.SERVER_PW}@${process.env.CLUSTER_NAME}.mq7d0.mongodb.net/Cluster0?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

//User modal
const User = moongose.model("User", {
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid!");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: 7,
    required: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain password.");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
});

//Task modal
const Task = moongose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const me = new User({
  name: "Gokce",
  email: "yalcin41@gmail.com",
  password: "     dasdadasdassd    ",
  age: 23,
});
me.save()
  .then((data) => {
    console.log(data);
  })
  .then((err) => {
    console.log(err);
  });
