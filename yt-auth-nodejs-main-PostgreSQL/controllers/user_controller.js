const notification = require("../models/notification");

exports.logout = (req, res, next) => {
  Permissions.deleteOne({ PermissionsId }).catch((error) => {
    console.log(error);
  });
};

exports.home = async (req, res, next) => {
  await notification
    .findAll({ where: { sendto: req.user.userid } })
    .then(async (notification) => {
      const notseen = Object.values(notification).filter(item => item.isseen === false).length
      res.render("index", {
      user: req.user,
      notifications: notification,
      isseen:notseen,
    });
    })
  
};
