const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceBooking = sequelize.define('ServiceBooking', {
  dealer: DataTypes.STRING,
  date_time: DataTypes.DATE,
  communication_channel: DataTypes.ENUM('Call', 'Email', 'WhatsApp', 'SMS'),
  description: DataTypes.TEXT,
  user_id: DataTypes.INTEGER // Added to link to a user
});

module.exports = ServiceBooking;