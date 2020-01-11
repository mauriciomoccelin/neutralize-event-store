const {
  DB_HOST,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
} = require('./.env')

// knex migrate:make migration_name
// knex migrate:latest

module.exports = {
  client: 'mssql',
  connection: {
    host: process.env.DB_HOST || DB_HOST,
    database: process.env.DB_DATABASE || DB_DATABASE,
    user: process.env.DB_USER || DB_USER,
    password: process.env.DB_PASSWORD || DB_PASSWORD
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}