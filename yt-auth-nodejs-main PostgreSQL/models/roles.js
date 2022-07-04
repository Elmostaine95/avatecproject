const mongoose = require("mongoose");

const rolseSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
});

const Roles = mongoose.model("Roles", rolseSchema);
module.exports = Roles;