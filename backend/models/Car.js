const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Car = sequelize.define('Car', {
  model: DataTypes.STRING,
  category: DataTypes.STRING,
  starting_ex_showroom: DataTypes.STRING,
  model_page: DataTypes.STRING,
  image_url: DataTypes.STRING,
  key_features: DataTypes.TEXT,
  typical_accessories: DataTypes.TEXT,
  notes: DataTypes.TEXT,
}, {
  timestamps: false
});

module.exports = Car;