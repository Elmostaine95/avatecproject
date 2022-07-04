const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const permissionsSchema = new mongoose.Schema({
  roleId: {
    type: Schema.Types.ObjectId,
    ref:"roles",
    required: true,
  },
  menuPageId: {
    type: Schema.Types.ObjectId,
    ref:"MenuPages",
    required: true,
  },
  readAccess: {
    type: Boolean,
    required: true,
  },
  createAccess: {
    type: Boolean,
    required: true,
  },
  editAccess: {
    type: Boolean,
    required: false,
  },
  deleteAccess: {
    type: Boolean,
    required: false,
  },
});

const Permissions = mongoose.model("Permissions", permissionsSchema);
module.exports = Permissions;