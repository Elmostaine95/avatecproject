const mongoose = require("mongoose");

const menuPagesSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
  },
});

const MenuPages = mongoose.model("MenuPages", menuPagesSchema);
module.exports = MenuPages;
