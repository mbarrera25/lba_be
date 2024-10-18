const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const Currency = sequelize.define('currency', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'currency'
  });

module.exports = Currency
