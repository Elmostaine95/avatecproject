const Task = require("../models/task");
const User = require("../models/User");
const files = require("../models/files");
const folders = require("../models/folders");
const notification = require("../models/notification");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const extract = require('extract-zip');
const fs = require("fs");
const { Console } = require("console");;
const dirTree = require("directory-tree");
const fsExtra = require('fs-extra');
const AdmZip = require("adm-zip");
var zip = new AdmZip();

exports.todo = async (req, res, next) => {
  const notifications = await Notification.find({
    isSeen: "false",
    sendto: req.user._id,
  });
  const tasks = await Task.find();
  const users = await User.find({}).select("name _id");
  res.render("app-todo", {
    user: req.user,
    users: users,
    notifications: notifications,
    tasks: tasks,
  });
};

exports.newTask = async (req, res, next) => {
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
  await notification
    .findAll({ where: { sendto: req.user.userid } })
    .then(async (notification) => {
      if (req.user.role == "Manager") {
        await files.findAll().then(async (files) => {
          await folders.findAll().then(async (folders) => {
            await User.findAll().then((users) => {
              const notseen = Object.values(notification).filter(
                (item) => item.isseen === false
              ).length;
              res.render("app-file-manager", {
                user: req.user,
                files: files,
                folders: folders,
                users: users,
                notifications: notification,
                isseen: notseen,
              });
            });
          });
        });
      } else {
        await files
          .findAll({ where: { userid: req.user.userid } })
          .then(async (files) => {
            await folders
              .findAll({ where: { userid: req.user.userid } })
              .then(async (folders) => {
                await User.findAll().then((users) => {
                  let userid = req.user.userid;
                  for (var i = 0; i < files.length; i++) {
                    if (files[i].dataValues.seen == "Bynoone") {
                      files.splice(i, 1);
                    } else if (files[i].dataValues.seen.Exceptby != null) {
                      if (
                        files[i].dataValues.seen.Exceptby.includes(userid) ==
                        true
                      ) {
                        files.splice(i, 1);
                      }
                    } else if (files[i].dataValues.seen.Onlyby != null) {
                      if (
                        files[i].dataValues.seen.Onlyby.includes(userid) ==
                        false
                      ) {
                        files.splice(i, 1);
                      }
                    }
                  }
                  for (var i = 0; i < folders.length; i++) {
                    if (folders[i].dataValues.seen == "Bynoone") {
                      folders.splice(folders[i], 1);
                    } else if (folders[i].dataValues.seen.Exceptby != null) {
                      if (
                        folders[i].dataValues.seen.Exceptby.includes(userid) ==
                        true
                      ) {
                        folders.splice(folders[i], 1);
                      }
                    } else if (folders[i].dataValues.seen.Onlyby != null) {
                      if (
                        folders[i].dataValues.seen.Onlyby.includes(userid) ==
                        false
                      ) {
                        folders.splice(folders[i], 1);
                      }
                    }
                  }

                  for (var i = 0; i < files.length; i++) {
                    if (files[i].dataValues.sharing == "Bynoone") {
                      files[i].dataValues.sharing = false;
                    } else if (files[i].dataValues.sharing.Exceptby != null) {
                      if (
                        files[i].dataValues.sharing.Exceptby.includes(userid) ==
                        true
                      ) {
                        files[i].dataValues.sharing = false;
                      } else {
                        files[i].dataValues.sharing = true;
                      }
                    } else if (files[i].dataValues.sharing.Onlyby != null) {
                      if (
                        files[i].dataValues.sharing.Onlyby.includes(userid) ==
                        false
                      ) {
                        files[i].dataValues.sharing = false;
                      } else {
                        files[i].dataValues.sharing = true;
                      }
                    } else {
                      files[i].dataValues.sharing = true;
                    }
                  }
                  for (var i = 0; i < folders.length; i++) {
                    if (folders[i].dataValues.sharing == "Bynoone") {
                      folders[i].dataValues.sharing = false;
                    } else if (folders[i].dataValues.sharing.Exceptby != null) {
                      if (
                        folders[i].dataValues.sharing.Exceptby.includes(
                          userid
                        ) == true
                      ) {
                        folders[i].dataValues.sharing = false;
                      }
                    } else if (folders[i].dataValues.sharing.Onlyby != null) {
                      if (
                        folders[i].dataValues.sharing.Onlyby.includes(userid) ==
                        false
                      ) {
                        folders[i].dataValues.sharing = false;
                      }
                    } else {
                      folders[i].dataValues.sharing = true;
                    }
                  }
                  const notseen = Object.values(notification).filter(
                    (item) => item.isseen === false
                  ).length;
                  res.render("app-file-manager", {
                    user: req.user,
                    files: files,
                    folders: folders,
                    users: users,
                    notifications: notification,
                    isseen: notseen,
                  });
                });
              });
          });
      }
    });
};

exports.uploadfile = async (req, res, next) => {
  try {
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
          " MB";
      else
        fileSize =
          (Math.round((file.size * 100) / 1024) / 100).toString() + " KB";
    }
    files.create({
      fileid: fileid,
      userid: req.user.userid,
      name: file.name,
      minetype: path.extname(file.name),
      filesize: fileSize,
      seen: { Onlyby: [req.user.userid] },
      sharing: { Onlyby: [req.user.userid] },
      downloadable: { Onlyby: [req.user.userid] },
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
    console.log(folder)
    const folderid = uuidv4();
    const savePath = path.join(
      __dirname,
      "..",
      "uploude",
      "folders",
      folderid+`.zip` 
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
          (Math.round((folder.size * 100) / 1024) / 100).toString() + " KB";
    }
    const activity = {action:"uploaded",from:req.user.userid,date:Date.now()};
    console.log(activity)
    folders.create({
      folderid: folderid,
      userid: req.user.userid,
      name: folder.name,
      foldersize: folderSize,
      activity: [activity],
      seen: { Onlyby: [req.user.userid] },
      sharing: { Onlyby: [req.user.userid] },
      downloadable: { Onlyby: [req.user.userid] },
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
  if (Object.keys(data).length == 1) {
    console.log(data)
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
        const name = result.name ;
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
            const name = result.name ;
            zip.addLocalFile(folderPath, name);
          });
      } else {
        await files
          .findOne({ where: { fileid: data[i].split(".")[0] } })
          .then((result) => {
            const folderPath = path.join(__dirname, "..", "uploude", "files", data[i] );
            const name = result.name;
            zip.addLocalFile(folderPath, name);
          });
      }
    }
    console.log(zip.toBuffer());
    var zipfolderpath = zip.toBuffer();
    const fileData = zipfolderpath;
    const fileName = "Avatec-Folders.zip";
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });
    const download = Buffer.from(fileData, "base64");
    res.end(download);
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

exports.deleteone = async (req, res, next) => {
  const foids = "";
  const data = req.body;
  if (data.Folder != undefined) {
    fs.unlink("./uploude/folders/" + data.Folder + ".zip", function (err) {
      console.log(err);
    });
    await folders.destroy({ where: { folderid: data.Folder } });
  } else {
    var key = Object.keys(data)[0];
    fs.unlink("./uploude/files/" + data[key] + key, function (err) {
      console.log(err);
    });
    await files.destroy({ where: { fileid: data[key] } });
  }
  res.redirect("/app/app-file-manager");
};

exports.setpermissions = async (req, res, next) => {
  data = JSON.parse(req.body.data);
  if (data.file == undefined) {
    let folderid = data.folder;
    if (data.seenby == "Exceptby" || data.seenby == "Onlyby") {
      let seen = data["seenby" + data.seenby];
      let seenby = data.seenby;
      let users = {};
      users[seenby] = seen;
      folders.update({ seen: users }, { where: { folderid: folderid } });
    } else {
      let seenby = data.seenby;
      folders.update({ seen: seenby }, { where: { folderid: folderid } });
    }

    if (data.sharingby == "Exceptby" || data.sharingby == "Onlyby") {
      let sharing = data["sharingby" + data.sharingby];
      let sharingby = data.sharingby;
      let users = {};
      users[sharingby] = sharing;
      folders.update({ sharing: users }, { where: { folderid: folderid } });
    } else {
      let sharingby = data.sharingby;
      folders.update({ sharing: sharingby }, { where: { folderid: folderid } });
    }

    if (data.downloadableby == "Exceptby" || data.downloadableby == "Onlyby") {
      let downloadable = data["downloadableby" + data.downloadableby];
      let downloadableby = data.downloadableby;
      let users = {};
      users[downloadableby] = downloadable;
      folders.update(
        { downloadable: users },
        { where: { folderid: folderid } }
      );
    } else {
      let downloadableby = data.downloadableby;
      folders.update(
        { downloadable: downloadableby },
        { where: { folderid: folderid } }
      );
    }
  } else {
    let fileid = data.file;
    if (data.seenby == "Exceptby" || data.seenby == "Onlyby") {
      let seen = data["seenby" + data.seenby];
      let seenby = data.seenby;
      let users = {};
      users[seenby] = seen;
      files.update({ seen: users }, { where: { fileid: fileid } });
    } else {
      let seenby = data.seenby;
      files.update({ seen: seenby }, { where: { fileid: fileid } });
    }

    if (data.sharingby == "Exceptby" || data.sharingby == "Onlyby") {
      let sharing = data["sharingby" + data.sharingby];
      let sharingby = data.sharingby;
      let users = {};
      users[sharingby] = sharing;
      files.update({ sharing: users }, { where: { fileid: fileid } });
    } else {
      let sharingby = data.sharingby;
      files.update({ sharing: sharingby }, { where: { fileid: fileid } });
    }

    if (data.downloadableby == "Exceptby" || data.downloadableby == "Onlyby") {
      let downloadable = data["downloadableby" + data.downloadableby];
      let downloadableby = data.downloadableby;
      let users = {};
      users[downloadableby] = downloadable;
      files.update({ downloadable: users }, { where: { fileid: fileid } });
    } else {
      let downloadableby = data.downloadableby;
      files.update(
        { downloadable: downloadableby },
        { where: { fileid: fileid } }
      );
    }
  }
  res.redirect("/app/app-file-manager");
};

exports.reportfile = async (req, res, next) => {
  notification.create({
    notificationid: uuidv4(),
    sendfrom: req.user.userid,
    sendto: req.body.sendto,
    subject: "Your File get reported",
    nots: req.body.file,
    details: "",
    isseen: false,
  });
  res.redirect("/app/app-file-manager");
};

exports.truenotification = async (req, res, next) => {
  notification.update(
    { isseen: "true" },
    { where: { sendto: req.user.userid } }
  );
};

exports.sharefile = async (req, res, next) => {
  data = JSON.parse(req.body.data);
  if (data.type == "Folder") {
    await folders
      .findOne({ where: { folderid: data.fileid } })
      .then(async (result) => {
        for (var i = 0; i < data.sharewith.length; i++) {
          await folders
            .findOne({
              where: { userid: data.sharewith[i], name: result.name },
            })
            .then((resu) => {
              console.log(resu);
              if (resu != null) {
                /*your teammate already had this folder*/
              } else {
                let newid = uuidv4();
                const savePath = path.join(
                  __dirname,
                  "..",
                  "uploude",
                  "folders",
                  newid + ".zip"
                );
                const oldPath = path.join(
                  __dirname,
                  "..",
                  "uploude",
                  "folders",
                  data.fileid + ".zip"
                );
                fs.copyFile(oldPath, savePath, (err) => {
                  if (err) throw err;
                });
                folders.create({
                  folderid: newid,
                  userid: data.sharewith[i],
                  name: result.name,
                  foldersize: result.foldersize,
                  seen: { Onlyby: [data.sharewith[i]] },
                  sharing: { Onlyby: [data.sharewith[i]] },
                  downloadable: { Onlyby: [data.sharewith[i]] },
                  createdat: Date.now(),
                  updatedat: Date.now(),
                });
                notification.create({
                  notificationid: uuidv4(),
                  sendfrom: req.user.userid,
                  sendto: data.sharewith[i],
                  subject: req.user.name + " shared a Folder with you",
                  nots: result.name,
                  details: "",
                  isseen: false,
                });
              }
            });
        }
      });
  } else {
    await files
      .findOne({ where: { fileid: data.fileid } })
      .then(async (result) => {
        for (var i = 0; i < data.sharewith.length; i++) {
          await files
            .findOne({
              where: { userid: data.sharewith[i], name: result.name },
            })
            .then((resu) => {
              console.log(resu);
              if (resu != null) {
                /*your teammate already had this file*/
              } else {
                let newid = uuidv4();
                const savePath = path.join(
                  __dirname,
                  "..",
                  "uploude",
                  "files",
                  newid + result.minetype
                );
                const oldPath = path.join(
                  __dirname,
                  "..",
                  "uploude",
                  "files",
                  data.fileid + result.minetype
                );
                fs.copyFile(oldPath, savePath, (err) => {
                  if (err) throw err;
                });
                files.create({
                  fileid: newid,
                  userid: data.sharewith[i],
                  name: result.name,
                  minetype: result.minetype,
                  filesize: result.filesize,
                  seen: { Onlyby: [data.sharewith[i]] },
                  sharing: { Onlyby: [data.sharewith[i]] },
                  downloadable: { Onlyby: [data.sharewith[i]] },
                  createdat: Date.now(),
                  updatedat: Date.now(),
                });
                notification.create({
                  notificationid: uuidv4(),
                  sendfrom: req.user.userid,
                  sendto: data.sharewith[i],
                  subject: req.user.name + " shared a File with you",
                  nots: result.name,
                  details: "",
                  isseen: false,
                });
              }
            });
        }
      });
  }
  console.log(data);
  res.redirect("/app/app-file-manager");
};

exports.preview = async (req, res, next) => {
  const data = req.body;
  const fromPath = path.join(__dirname,"..","uploude","files", data.fileid + data.minetype );
  const toPath = path.join( __dirname,"..","app-assets","preview",data.fileid + data.minetype);
  if (data.minetype == "Folder") {
    const fromfolderPath = path.join(__dirname,"..","uploude","folders",data.fileid+".zip" );
    const tofolderPath = path.join( __dirname,"..","app-assets","preview",data.fileid, data.name );
      await extract(fromfolderPath, { dir: tofolderPath })
      const tree = JSON.stringify(dirTree(tofolderPath, {attributes:["size", "type", "extension"]}));
      console.log(dirTree(tofolderPath, {attributes:["size", "type", "extension"]}))
      let newtree = tree.replace(/name/g, "text").replace(/extension/g, "type");
      res.send(newtree);
  } else {
    fs.copyFile(fromPath, toPath, (err) => {
      res.send("file");
      if (err) throw err;
    })
  }
};

exports.PreviewRemoveFile = async (req, res, next) => {
  const toPath = path.join(__dirname, "..", "app-assets", "preview");
  fs.readdir(toPath, (error, filesInDirectory) => {
    if (error) throw error;
    fsExtra.emptyDirSync(toPath);
  });
};

exports.renameDocument = async (req, res, next) => {
  console.log(req.body)
  const file = req.body;
  if( file.minetype == 'Folder'){
    folders.update(
      { name: file.NewDocumentName+".zip"},
      { where: { folderid: file.filesid  } }
    );
  }else{
    files.update(
    { name: file.NewDocumentName+file.minetype },
    { where: { fileid: file.filesid } }
  );
  }
  res.redirect('back');
};