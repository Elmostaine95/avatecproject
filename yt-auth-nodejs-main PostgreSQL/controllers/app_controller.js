const Task = require("../models/task");
const User = require("../models/User");
const files = require("../models/files");
const folders = require("../models/folders");
const Notification = require("../models/notification");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const zip = require("express-zip");
const fs = require("fs");

exports.updatnotification = async (req, res, next) => {
  Notification.updateMany(
    { sendto: req.user._id },
    { $set: { isSeen: "true" } }
  );
};

exports.todo = async (req, res, next) => {
  const notifications = await Notification.find({
    isSeen: "false",
    sendto: req.user._id,
  });
  const tasks = await Task.find();
  console.log(notifications);
  const users = await User.find({}).select("name _id");
  console.log(users);
  res.render("app-todo", {
    user: req.user,
    users: users,
    notifications: notifications,
    tasks: tasks,
  });
};

exports.newTask = async (req, res, next) => {
  console.log("newtask");
  console.log(req.body);

  try {
    const task = new Task({
      createdby: req.user.id,
      todoTitleAdd: req.body.todoTitleAdd,
      taskassigned: req.body.taskassigned,
      taskduedate: req.body.duedate,
      tasktag: req.body.tasktag,
      Description: req.body.Description,
    });
    await task.save();
    const notification = new Notification({
      from: req.user.id,
      sendto: req.body.taskassigned,
      subject: "New task",
      not: "received",
      details: "you are assigned to a new task",
      isSeen: "false",
    });
    await notification.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.redirect("/app/app-todo");
  } catch (error) {
    console.log(error);
  }
};

exports.roles = async (req, res, next) => {
  res.render("app-access-roles");
};

exports.permission = async (req, res, next) => {
  res.render("app-access-permission");
};

exports.filemanager = async (req, res, next) => {
  await files
    .findAll({ where: { userid: req.user.userid } })
    .then(async (files) => {
      await folders
        .findAll({ where: { userid: req.user.userid } })
        .then((folders) => {
          res.render("app-file-manager", { files: files, folders: folders });
        });
    });
};

exports.uploadfile = async (req, res, next) => {
  try {
    console.log(req.files.file);
    const file = req.files.file;
    const fileid = uuidv4();
    const nameid = fileid + path.extname(file.name);
    const savePath = path.join(__dirname, "..", "uploude", "files", nameid);
    await file.mv(savePath);
    if (file) {
      var fileSize = 0;
      if (file.size > 1024 * 1024)
        fileSize =
          (Math.round((file.size * 100) / (1024 * 1024)) / 100).toString() +
          "MB";
      else
        fileSize =
          (Math.round((file.size * 100) / 1024) / 100).toString() + "KB";
    }
    files.create({
      fileid: fileid,
      userid: req.user.userid,
      name: file.name,
      minetype: path.extname(file.name),
      filesize: fileSize,
      createdat: Date.now(),
      updatedat: Date.now(),
    });
  } catch (error) {
    console.log(error);
  }
  res.redirect("/app/app-file-manager");
};

exports.uploadfolder = async (req, res, next) => {
  try {
    const folder = req.files.upl;
    const folderid = uuidv4();
    const savePath = path.join(
      __dirname,
      "..",
      "uploude",
      "folders",
      folderid + ".zip"
    );
    await folder.mv(savePath);
    if (folder) {
      var folderSize = 0;
      if (folder.size > 1024 * 1024)
        folderSize =
          (Math.round((folder.size * 100) / (1024 * 1024)) / 100).toString() +
          "MB";
      else
        folderSize =
          (Math.round((folder.size * 100) / 1024) / 100).toString() + "KB";
    }
    folders.create({
      folderid: folderid,
      userid: req.user.userid,
      name: folder.name,
      foldersize: folderSize,
      createdat: Date.now(),
      updatedat: Date.now(),
    });
    res.redirect("/app/app-file-manager");
  } catch (error) {
    console.log(error);
  }
};

exports.downloadfile = async (req, res, next) => {
  const data = req.body;
  console.log(Object.keys(data).length);
  if (Object.keys(data).length == 1) {
    let i = Object.keys(data)[0];
    if (data[i].split(".")[1] === undefined) {
      await folders.findOne({ where: { folderid: data[i] } }).then((result) => {
        const folderPath = path.join(
          __dirname,
          "..",
          "uploude",
          "folders",
          data[i] + ".zip"
        );
        const name = result.name + ".zip";
        res.download(folderPath, name);
      });
    } else {
      await files
        .findOne({ where: { fileid: data[i].split(".")[0] } })
        .then((result) => {
          const folderPath = path.join(
            __dirname,
            "..",
            "uploude",
            "files",
            data[i]
          );
          const name = result.name;
          res.download(folderPath, name);
        });
    }
  } else {
    const filesdw = [];
    for (const i in data) {
      if (data[i].split(".")[1] === undefined) {
        await folders
          .findOne({ where: { folderid: data[i] } })
          .then((result) => {
            const folderPath = path.join(
              __dirname,
              "..",
              "uploude",
              "folders",
              data[i] + ".zip"
            );
            const name = result.name + ".zip";
            filesdw.push({ path: folderPath, name: name });
          });
      } else {
        await files
          .findOne({ where: { fileid: data[i].split(".")[0] } })
          .then((result) => {
            const folderPath = path.join(
              __dirname,
              "..",
              "uploude",
              "files",
              data[i]
            );
            const name = result.name;
            filesdw.push({ path: folderPath, name: name });
          });
      }
    }
    console.log(filesdw);
    res.zip(filesdw);
  }
};

exports.deletefile = async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  const flids = [];
  const foids = [];
  for (const i in data) {
    if (data[i].split(".")[1] === undefined) {
      fs.unlink("./uploude/folders/" + data[i] + ".zip", function (err) {
        console.log(err);
      });
      foids.push(data[i].split(".")[0]);
    } else {
      fs.unlink("./uploude/files/" + data[i], function (err) {
        console.log(err);
      });
      flids.push(data[i].split(".")[0]);
    }
  }
  await files.destroy({ where: { fileid: flids } });
  await folders.destroy({ where: { folderid: foids } });
};
