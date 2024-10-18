const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const ExchangeCurrency = sequelize.define('exchange_currency', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    currency_id: {
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
