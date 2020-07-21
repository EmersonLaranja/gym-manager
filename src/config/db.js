const { Pool } = require('pg');

module.exports = new Pool({
  user: 'postgres',
  password: 'laranja',
  host: 'localhost',
  port: 5432,
  database: 'gymmanager',
});
