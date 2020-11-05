const moongose = require("mongoose");

//Task schema
const taskSchema = new moongose.Schema(
  {
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
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Task modal
const Task = moongose.model("Task", taskSchema);
module.exports = Task;
