const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const result = sequelize.define('result_patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    observation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    valor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'result_patient',
});




module.exports = result;