const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;
if (process.env.DB_HOST) {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_PATH || 'dev.sqlite',
    logging: false,
  });
}

module.exports = sequelize;