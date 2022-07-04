const Permissions = require("../models/permissions");

exports.create = (req, res, next) => {
  const newPermissions = new Permissions({
    PermissionsId: PermissionsId,
    roled: roled,
    menuPaged: menuPaged,
    readAccess: readAccess,
    creatrAccess: creatrAccess,
    editAccess: editAccess,
    deletAccess: deletAccess,
  });

  newPermissions.save().catch((error) => {
    console.log(error);
  });
};
exports.edit = (req, res, next) => {
  Permissions.updateOne(
    { PermissionsId: PermissionsId },
    { roled: roled },
    { menuPaged: menuPaged },
    { readAccess: readAccess },
    { creatrAccess: creatrAccess },
    { editAccess: editAccess },
    { deletAccess: deletAccess }
  ).catch((error) => {
    console.log(error);
  });
};
exports.getById = (req, res, next) => {
  let { PermissionsId } = req.params;
  Permissions.find({ PermissionsId }).catch((error) => {
    console.log(error);
  });
};
exports.getall = (req, res, next) => {
  Permissions.find({}).catch((error) => {
    console.log(error);
  });
};
exports.delete = (req, res, next) => {
  Permissions.deleteOne({ PermissionsId }).catch((error) => {
    console.log(error);
  });
};
