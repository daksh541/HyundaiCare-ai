const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Match = sequelize.define('Match', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  suggestedCarId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userPreferences: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  companyOfferedResale: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Match;
