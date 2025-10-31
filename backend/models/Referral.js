const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Referral = sequelize.define('Referral', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  referralCode: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  points: DataTypes.INTEGER,
  referrals_count: DataTypes.INTEGER,
});

module.exports = Referral;