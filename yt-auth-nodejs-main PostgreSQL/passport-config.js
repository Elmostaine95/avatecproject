const LocalStrategy = require("passport-local").Strategy;
const MenuPages = require("./models/menuPages");
const Permissions = require("./models/permissions");
const Roles = require("./models/roles");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const speakeasy = require("speakeasy");


function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }
    if (user.verified == false) {
      return done(null, false, { message: "Email hasn't been verified yet" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.userid));
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
