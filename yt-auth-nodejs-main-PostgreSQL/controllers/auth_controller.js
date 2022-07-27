const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const passport = require("passport");
const speakeasy = require("speakeasy");
const Users = require("../models/User");
const UserVerification = require("../models/UserVerification");

exports.signUp = (req, res, next) => {
  res.render("auth-register-basic");
};

exports.loginPg = (req, res, next) => {
  res.render("auth-login-basic");
};

exports.login = passport.authenticate("local", {
  successRedirect: "/auth/Authenticationpag",
  failureRedirect: "/auth/login",
  failureFlash: true,
});

exports.authenticationpag = (req, res, next) => {
  if (req.user.twofactorenabled == true) {
    res.render("auth-two-steps-basic", { message: "" });
  } else {
    res.redirect("/user/");
  }
};

exports.authentication = (req, res, next) => {
  const token =
    req.body.dg1 +
    req.body.dg2 +
    req.body.dg3 +
    req.body.dg4 +
    req.body.dg5 +
    req.body.dg6;
  const secret = req.user.encodedtotpkey;
  const verified = speakeasy.totp.verify({ secret, encoding: "base32", token });
  if (verified == true) {
    res.redirect("/user/");
  } else {
    res.render("auth-two-steps-basic", {
      message: "The authenticator PIN is incorrect or has been expired",
    });
  }
};

exports.register = async (req, res, next) => {
  Users.findOne({ where: { email: req.body.email } }).then((userFound) => {
    if (userFound) {
      req.flash("error", "User with that email already exists");
      res.redirect("/auth/signUp");
    } else {
      try {
        Users.create({
          userid: uuidv4(),
          name: req.body.name,
          email: req.body.email,
        }).then((result) => {
          //url to be used in the email
          const currentUrl = "http://localhost:3000/";
          const uniqueString = uuidv4() + result.userid;
          // mail options
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: result.email,
            subject: "Verify Your Email",
            html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link</p><b>expires in 1 hours </b>.<p>Press <a href=${
              currentUrl + "auth/verify/" + result.userid + "/" + uniqueString
            }>here </a>to proceed</p>`,
          };
          //hash the uniqueString
          const saltRounds = 10;
          bcrypt.hash(uniqueString, saltRounds).then((hasheUniqueString) => {
            // set values in userVerification collection
            UserVerification.create({
              uniquestring: hasheUniqueString,
              userid: result.userid,
              createdat: Date.now(),
              expiredat: Date.now() + 3600000,
            }).then((result) => {
              transporter.sendMail(mailOptions);
            });
          });
        });
        res.redirect("/auth/verify");
      } catch (error) {
        console.log(error);
        res.redirect("/auth/register");
      }
    }
  });
};

exports.setPassword = async (req, res, next) => {
  let { userId, uniqueString } = req.params;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  Users.findOne({ where: { userid: userId } }).then((result) => {
    if (result) {
      try {
        Users.update(
          { password: hashedPassword },
          { where: { userid: userId } }
        ).then((result) => {
          res.redirect("/auth/login");
        });
      } catch (error) {
        console.log(error);
        res.redirect("/auth/signUp");
      }
    } else {
      req.flash("error", "error has occurred .Please sign up again");
      res.redirect("/auth/signUp");
    }
  });
};

exports.logout = (req, res, next) => {
  req.logOut();
  res.redirect("/auth/login");
};

//Verify page route
exports.verified = (req, res, next) => {
  res.render("auth-verified-email");
};

//Verify page route
exports.verify = (req, res, next) => {
  res.render("auth-verify-email-basic");
};

//Verify Link
exports.verifylink = (req, res, next) => {
  let { userId, uniqueString } = req.params;

  UserVerification.findOne({ where: { userid: userId } }).then((result) => {
    if (result) {
      // user verification record exists so we proceed
      const { expiredAt } = result.expiredat;
      const hasheUniqueString = result.uniqueString;
      //checking has expired unique steing
      if (expiredAt < Date.now()) {
        UserVerification.destroy({ where: { userid: userId } }).then(
          (result) => {
            let sqlduv = `DELETE * FROM users WHERE userId = '${userId}'`;
            Users.destroy({ where: { userid: userId } }).then((result) => {
              let message = "Link has expired .Please sign up again";
              res.render("auth-verified-email", { message: message });
            });
          }
        );
      } else {
        //velid record exists so we validate the use string
        // First comper the hashed unıque string
        bcrypt
          .compare(uniqueString, hasheUniqueString)
          .then((result) => {
            if (result) {
              //string match
              Users.update(
                { verified: "true" },
                { where: { userid: userId } }
              ).then((result) => {
                UserVerification.destroy({ where: { userid: userId } }).then(
                  (result) => {
                    let message =
                      "Email has been verified Please set your Password";
                    res.render("auth-verified-email", { message: message });
                  }
                );
              });
            } else {
              let message =
                "Invalid verification deteails passed. Cheeck your inbox.";
              res.render("auth-verified-email", { message: message });
            }
          })
          .catch((eroor) => {
            let message = "An error ocoured while comparing unique strings";
            res.render("auth-verified-email", { message: message });
          });
      }
    } else {
      //Usser verification record doesnt exist
      let message =
        "Account record doesnt exist or has been verified already .Please sign up or log in.";
      res.render("auth-verified-email", { message: message });
    }
  });
};

//Email Verification
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log("success");
  }
});
