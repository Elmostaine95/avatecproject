const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  sendto: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  not: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  isSeen: {
    type: String,
    required: false,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;