const Notification = require("../models/notification");

exports.logout = (req, res, next) => {
  Permissions.deleteOne({ PermissionsId }).catch((error) => {
    console.log(error);
  });
};

exports.home = async (req, res, next) => {
  res.render("index", {
    user: req.user,
    name: req.user.name,
    notifications: [0],
  });
};
