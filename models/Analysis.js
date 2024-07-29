const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Analysis = sequelize.define('Analysis',{

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        //unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        //unique: true,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        //unique: true,
        allowNull: false,
      },
      currency: {
        type: DataTypes.DOUBLE,
        //unique: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }

}, {
    tableName: 'analysis'
});

module.exports = Analysis;