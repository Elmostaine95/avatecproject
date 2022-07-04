const express = require('express');
const router = express.Router();
const user_controller = require("../controllers/user_controller");
const {
    checkAuthenticated,
    checkNotAuthenticated,
  } = require("../middlewares/auth");

router.get("/", checkAuthenticated, user_controller.home);
router.delete("/logout", user_controller.logout);


module.exports = router;