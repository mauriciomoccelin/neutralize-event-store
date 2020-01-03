const {
  DB_HOST,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
} = require('./.env')

module.exports = {
  client: 'mssql',
  connection: {
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}