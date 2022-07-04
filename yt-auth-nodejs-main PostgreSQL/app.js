const express = require("express");
require("dotenv").config();
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("express-flash");
var bodyParser = require("body-parser");
var fileupload = require("express-fileupload");
const db = require("./config/database");
const Users = require("./models/User");

// / means the root of the current drive
// ./ means the current directory
// ../ means the parent of the current directory
const authRoutes = require("./routes/auth"); //Import our auth routes
const userRoutes = require("./routes/user"); //Import our user routes
const appRoutes = require("./routes/app"); //Import our app routes
const permissionsRoutes = require("./routes/permissions"); //Import our permissions routes
const pageRoutes = require("./routes/page"); //Import our page routes
const roleRoutes = require("./routes/rolse"); //Import our roles routes

const app = express();

const passport = require("passport");
const { Router } = require("express");
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  async (email) => {
    return await Users.findOne({ where: { email: email } })
      .then((res) => {
        return res;
      })
      .catch((e) => console.log(e));
  },
  async (id) => {
    return await Users.findOne({ where: { userid: id } })
      .then((res) => {
        return res;
      })
      .catch((e) => console.log(e));
  }
);

//Load Views
app.set("view engine", "ejs");
app.use(express.static("app-assets"));

app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(fileupload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Connect To db
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("error" + err));

const server = app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});

//Store My DB into express object so i can access it everywhere

//Everytime we ask for /auth we assign it to authRoutes
//Everytime we ask for /user we assign it to userRoutes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/app", appRoutes);
app.use("/permissions", permissionsRoutes);
app.use("/page", pageRoutes);
app.use("/role", roleRoutes);

module.exports = app;
