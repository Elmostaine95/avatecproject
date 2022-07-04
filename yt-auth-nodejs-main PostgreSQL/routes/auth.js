const express = require('express');
const router = express.Router();
const auth_controller = require("../controllers/auth_controller");
const {
    checkAuthenticated,
    checkNotAuthenticated,
  } = require("../middlewares/auth");

 
router.get("/signUp", checkNotAuthenticated, auth_controller.signUp);
router.post("/register", auth_controller.register);
router.post("/verify/:userId/:uniqueString", checkNotAuthenticated, auth_controller.setPassword);
router.get("/login", checkNotAuthenticated, auth_controller.loginPg);
router.post("/login", auth_controller.login);
router.delete("/logout", auth_controller.logout);
router.get("/verified", checkAuthenticated, auth_controller.verified);
router.get("/verify", checkNotAuthenticated, auth_controller.verify);
router.get("/Authenticationpag", checkAuthenticated, auth_controller.authenticationpag);
router.post("/Authentication", checkAuthenticated, auth_controller.authentication);
router.get("/verify/:userId/:uniqueString", checkNotAuthenticated, auth_controller.verifylink);


module.exports = router;