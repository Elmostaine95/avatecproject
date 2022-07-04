const Sequelize  = require('sequelize');

module.exports = new Sequelize('postgres', 'postgres', 'admin', {
    host: 'localhost',
    dialect:'postgres',
    define:{
        timestamps: false,
        freezeTableName: true
    }
  });