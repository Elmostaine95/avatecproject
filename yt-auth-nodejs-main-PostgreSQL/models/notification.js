const Sequelize = require("sequelize");
const db = require('../config/database')

const notification = db.define('notification',{

  notificationid: {
    primaryKey: true,
    type: Sequelize.STRING
  },
  sendfrom: {
    type: Sequelize.STRING
  },
  sendto: {
    type: Sequelize.STRING
  },
  subject: {
    type: Sequelize.STRING
  },
  nots: {
    type: Sequelize.STRING
  },
  details: {
    type: Sequelize.STRING
  },
  isseen: {
    type: Sequelize.BOOLEAN
  },
});

module.exports = notification;