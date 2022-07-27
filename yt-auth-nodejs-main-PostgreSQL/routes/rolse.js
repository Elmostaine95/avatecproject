const express = require('express');
const router = express.Router();
const Roles_controller = require("../controllers/Roles_controller");
const {
    checkAuthenticated,
    checkNotAuthenticated,
  } = require("../middlewares/auth");


router.get("/Roles/create", checkAuthenticated, Roles_controller.create);
router.get("/Roles/edit", checkAuthenticated, Roles_controller.edit);
router.get("/Roles/:RoleId", checkAuthenticated, Roles_controller.getById);
router.get("/Roles/getall", checkAuthenticated, Roles_controller.getall);
router.get("/Roles/delete", checkAuthenticated, Roles_controller.delete);


module.exports = router;