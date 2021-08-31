// knex migrate:latest
// knex migrate:make migration_name  -x ts

export default {
  client: "mssql",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    tableName: "migrations",
  },
};
