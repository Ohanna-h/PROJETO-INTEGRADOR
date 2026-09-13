const mysql = require("mysql2/promise");
require("dotenv").config();

// Pool de conexões: reaproveita conexões abertas em vez de criar
// uma nova a cada consulta — melhor para um totem que fica ligado
// o dia inteiro fazendo várias requisições.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "plataforma_senai",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  charset: "utf8mb4",
});

module.exports = pool;
