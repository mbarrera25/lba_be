const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const invoice = sequelize.define('invoice',{
    
    date_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    identification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type_person: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direction:{
        type: DataTypes.STRING,
        allowNull: false
    },
    invoice_number: {
        type: DataTypes.STRING,
        allowNull: false

    },
    total_amount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    subtotal_amount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    igtf: {
        type:DataTypes.DOUBLE
    },
    rate:{
        type: DataTypes.DOUBLE,
    }

//currency
//invoice_line

})

module.exports = invoice;