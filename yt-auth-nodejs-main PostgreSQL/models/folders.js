const Sequelize = require("sequelize");
const db = require('../config/database')

const folders = db.define('folders',{
  folderid: {
    primaryKey: true,
    type: Sequelize.STRING
  },
  userid: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  foldersize: {
    type: Sequelize.INTEGER,
  },
  createdat: {
    type: Sequelize.STRING
  },
  updatedat: {
    type: Date,
  },
});


module.exports = folders;
