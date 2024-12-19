const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

module.exports = pool;
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER, // IP o nombre del servidor
  database: process.env.SQL_DATABASE,
  port: parseInt(process.env.SQL_PORT, 10), // Asegúrate de que sea un número
  options: {
    encrypt: true, // Si usas Azure, debes encriptar la conexión
    trustServerCertificate: true, // Cambia a 'false' si no confías en el certificado del servidor
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Conexión a SQL Server establecida correctamente');
    return pool;
  })
  .catch((err) => {
    console.error('Error al conectar a SQL Server: ', err);
  });

module.exports = {
  sql,
  poolPromise,
};
