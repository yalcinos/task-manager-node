const moongose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new moongose.Schema({
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

//Pre: get executed before users are saved to the DB. It is middleware. It is similar like SQL Trigger!
//next params: next will call after the function execution is done.
//Before save the user into DB , hash password.
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
//User modal
const User = moongose.model("User", userSchema);
module.exports = User;
