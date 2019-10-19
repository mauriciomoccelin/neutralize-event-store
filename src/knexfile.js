const {
  HOST,
  DATABASE,
  USER,
  PASSWORD
} = require('./.env')

module.exports = {
    client: 'mssql',
    connection: {
      host: HOST,
      database: DATABASE,
      user: USER,
      password: PASSWORD
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};