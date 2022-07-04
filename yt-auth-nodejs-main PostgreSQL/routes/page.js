const express = require('express');
const router = express.Router();
const page_controller = require("../controllers/page_controller");
const {
    checkAuthenticated,
    checkNotAuthenticated,
  } = require("../middlewares/auth");

 
router.get("/profile", checkAuthenticated, page_controller.profile);
router.get("/security", checkAuthenticated, page_controller.security);
router.post("/twofactorenabled", checkAuthenticated, page_controller.twofactorenabled);


module.exports = router;


