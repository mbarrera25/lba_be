const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const Currency = sequelize.define('Currency', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    simbolo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'currency'
  });

module.exports = Currency
