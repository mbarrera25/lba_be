const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Currency = require("./currency")

const MetodoDePago = sequelize.define(
  "payment_method",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Campo adicional para la clave foránea
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Currency,
        key: "id",
      },
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "payment_method",
  }
);

module.exports = MetodoDePago;
