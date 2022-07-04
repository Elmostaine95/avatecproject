const Sequelize = require("sequelize");
const db = require('../config/database')

const files = db.define('files',{
  fileid: {
    primaryKey: true,
    type: Sequelize.STRING
  },
  userid: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  minetype: {
    type: Sequelize.STRING
  },
  filesize: {
    type: Sequelize.INTEGER,
  },
  createdat: {
    type: Sequelize.STRING
  },
  updatedat: {
    type: Date,
  },
});


module.exports = files;
