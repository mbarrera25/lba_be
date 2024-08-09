const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const ExchangeCurrency = sequelize.define('ExchangeCurrency', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    currencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'currency',
        key: 'id'
      }
    }
  }, {
    tableName: 'exchange_currency'
  });
  
 module.exports = ExchangeCurrency
