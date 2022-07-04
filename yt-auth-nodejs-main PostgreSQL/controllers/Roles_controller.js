const Roles = require("../models/roles");

exports.create = (req, res, next) => {
  const newRole = new Roles({
    RoleId: RoleId,
    displaayName: displaayName,
  });

  newRole.save().catch((error) => {
    console.log(error);
  });
};
exports.edit = (req, res, next) => {
  Roles.updateOne({ RolesId: RolesId }, { displaayName: displaayName }).catch(
    (error) => {
      console.log(error);
    }
  );
};
exports.getById = (req, res, next) => {
  let { RolesId } = req.params;
  Roles.find({ RolesId }).catch((error) => {
    console.log(error);
  });
};
exports.getall = (req, res, next) => {
  Roles.find({}).catch((error) => {
    console.log(error);
  });
};
exports.delete = (req, res, next) => {
  Roles.deleteOne({ RolesId }).catch((error) => {
    console.log(error);
  });
};
