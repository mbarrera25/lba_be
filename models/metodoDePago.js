const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Currency = require("./Currency")

const MetodoDePago = sequelize.define(
  "MetodoDePago",
  {
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Campo adicional para la clave foránea
    currencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Currency,
        key: "id",
      },
    },
    simbolo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "metodos_de_pago",
  }
);

module.exports = MetodoDePago;
