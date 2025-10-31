const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Valuation = sequelize.define('Valuation', {
  model: DataTypes.STRING,
  year: DataTypes.INTEGER,
  kms: DataTypes.INTEGER,
  city: DataTypes.STRING,
  accident_history: DataTypes.BOOLEAN,
  service_history: DataTypes.BOOLEAN,
  estimated_value: DataTypes.STRING,
  photos: DataTypes.JSON, // Added for photos
  user_id: DataTypes.INTEGER // Added to link valuation to a user
});

module.exports = Valuation;