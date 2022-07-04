const Notification = require("../models/notification");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const Users = require("../models/User");

exports.profile = async (req, res, next) => {
  const notifications = await Notification.find({
    isSeen: "false",
    sendto: req.user._id,
  });
  res.render("page-profile", { user: req.user, notifications: notifications });
};

exports.security = async (req, res, next) => {
  const tempt_secret = speakeasy.generateSecret();
  qrcode.toDataURL(tempt_secret.otpauth_url, function (err, data) {
    Users.update(
      { encodedtotpkey: tempt_secret.base32 },
      { where: { userid: req.user.userid } }
    ).then((userFound) => {
      res.render("page-account-settings-security", {
        user: req.user,
        url: data,
      });
    });
  });
};

exports.twofactorenabled = async (req, res, next) => {
  Users.update(
    { twofactorenabled: "true" },
    { where: { userid: req.user.userid } }
  ).then((userFound) => {
    res.redirect("/user/");
  });
};
