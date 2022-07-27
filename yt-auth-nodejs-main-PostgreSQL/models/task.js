const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  todoTitleAdd: {
    type: String,
    required: true,
  },
  taskassigned: {
    type: String,
    required: true,
  },
  taskduedate: {
    type: String,
    required: true,
  },
  tasktag: {
    type: [],
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  createdby: {
    type: String,
    required: false,
  },

});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
