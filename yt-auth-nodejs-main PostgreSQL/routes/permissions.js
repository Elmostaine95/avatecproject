const express = require('express');
const router = express.Router();

const Permissions_controller = require("../controllers/Permissions_controller");
const {
    checkAuthenticated,
    checkNotAuthenticated,
  } = require("../middlewares/auth");


router.get("/Permissions/create", checkAuthenticated, Permissions_controller.create);
router.get("/Permissions/edit", checkAuthenticated, Permissions_controller.edit);
router.get("/Permissions/:PermissionsId", checkAuthenticated, Permissions_controller.getById);
router.get("/Permissions/getall", checkAuthenticated, Permissions_controller.getall);
router.get("/Permissions/delete", checkAuthenticated, Permissions_controller.delete);


module.exports = router;