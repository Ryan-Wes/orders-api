const { Pool } = require("pg");

// conexão com o banco PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "orders_api",
  password: "Ikatteimasu3!",
  port: 5432,
});

module.exports = pool;