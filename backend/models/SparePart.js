const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SparePart = sequelize.define('SparePart', {
  part_name: DataTypes.STRING,
  price: DataTypes.STRING,
  car_id: DataTypes.INTEGER, // Added to link to a specific car model
  description: DataTypes.TEXT,
  stock_quantity: DataTypes.INTEGER,
  supplier: DataTypes.STRING
});

module.exports = SparePart;