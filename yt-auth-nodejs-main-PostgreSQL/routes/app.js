const express = require('express');
const router = express.Router();
const app_controller = require("../controllers/app_controller");
const {
    checkAuthenticated,
    checkNotAuthenticated,
  } = require("../middlewares/auth");

 
router.get("/app-todo", checkAuthenticated, app_controller.todo);
router.post("/newTask", checkAuthenticated, app_controller.newTask);
router.get("/app-reles", checkAuthenticated, app_controller.roles);
router.get("/app-permission", checkAuthenticated, app_controller.permission);
router.get("/app-file-manager", checkAuthenticated, app_controller.filemanager);
router.post("/file-upload", checkAuthenticated, app_controller.uploadfile);
router.post("/folder-upload", checkAuthenticated, app_controller.uploadfolder);
router.post("/downloadfile", checkAuthenticated, app_controller.downloadfile);
router.post("/deletefile", checkAuthenticated, app_controller.deletefile);
router.post("/preview", checkAuthenticated, app_controller.preview);
router.post("/deleteone", checkAuthenticated, app_controller.deleteone);
router.post("/setpermissions", checkAuthenticated, app_controller.setpermissions);
router.post("/reportfile", checkAuthenticated, app_controller.reportfile);
router.post("/truenotification", checkAuthenticated, app_controller.truenotification);
router.post("/sharefile", checkAuthenticated, app_controller.sharefile);
router.post("/PreviewRemoveFile", checkAuthenticated, app_controller.PreviewRemoveFile);
router.post("/renameDocument", checkAuthenticated, app_controller.renameDocument);






module.exports = router;