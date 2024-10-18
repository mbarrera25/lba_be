const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const TestDetail = sequelize.define('TestDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        //unique: true,
        allowNull: false,
      },
      list_value: {
        type: DataTypes.STRING,
        //unique: true,
        allowNull: false,
      },
      indicator: {
        type: DataTypes.STRING,
        //unique: true,
        allowNull: false,
      },
      result_value: {
        type: DataTypes.STRING,
      },
      test_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'test', // Nombre de la tabla de `Test`
          key: 'id'
        }
      },
},{
    tableName: 'test_detail'
});

module.exports = TestDetail;