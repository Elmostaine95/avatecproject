const Sequelize = require("sequelize");
const db = require('../config/database')

const UserVerification =  db.define('userverification',{
  userid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  uniquestring: {
    type: Sequelize.STRING,
  },
  createdat: {
    type: Sequelize.STRING,
  },
  expiredat: {
    type: Sequelize.STRING,
  },
});

module.exports = UserVerification;
