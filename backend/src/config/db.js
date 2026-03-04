const knex = require('knex');
const env = require('./env');

const db = knex({
  client: 'mysql2',
  connection: {
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    ssl: env.database.ssl ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations'
  }
});

module.exports = db;
