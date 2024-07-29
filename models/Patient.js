// models/Patient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['masculino', 'femenino'],
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identification: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },{
    tableName: 'patient'
  });


module.exports = Patient;
