const Sequelize = require("sequelize");
const db = require('../config/database')

const Users = db.define('users',{
  userid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  passwordresettoken: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING
  },
  resettokencreatedat: {
    type: Date,
  },
  encodedtotpkey: {
    type: Sequelize.STRING
  },
  twofactorforced: {
    type: Sequelize.STRING
  },
  twofactorenabled: {
    type: Sequelize.STRING
  },
});


module.exports = Users;
