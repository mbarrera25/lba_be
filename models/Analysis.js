const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Analysis = sequelize.define('analysis',{

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

Analysis.associate = (models) => {
  Analysis.belongsToMany(models.Solicitud, {
    through: 'request_analysis',
    foreignKey: 'analysis_id',
    otherKey: 'request_id',
    as: 'request', // Definición del alias en la relación inversa
  });
};
module.exports = Analysis;