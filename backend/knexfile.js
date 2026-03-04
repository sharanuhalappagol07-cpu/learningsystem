const env = require('./src/config/env');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: env.database.host,
      port: env.database.port,
      user: env.database.user,
      password: env.database.password,
      database: env.database.name,
      ssl: env.database.ssl ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: './migrations'
    }
  },
  
  production: {
    client: 'mysql2',
    connection: {
      host: env.database.host,
      port: env.database.port,
      user: env.database.user,
      password: env.database.password,
      database: env.database.name,
      ssl: env.database.ssl ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: './migrations'
    }
  }
};
