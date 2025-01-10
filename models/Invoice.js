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
        allowNull: false,
        unique: true

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
    },
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'requests', // Nombre de la tabla
          key: 'id',         // Clave primaria en `requests`
        },
      },
      pay_method: {
        type:DataTypes.STRING
    },

//currency
//invoice_line

})

// Relación con requests
invoice.associate = (models) => {
    invoice.belongsTo(models.request, {
      foreignKey: 'request_id',
      as: 'request',
    });
  };

module.exports = invoice;