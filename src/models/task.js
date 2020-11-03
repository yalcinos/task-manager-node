const moongose = require("mongoose");

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
  owner: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = Task;
