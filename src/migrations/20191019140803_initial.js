const dbdf = require('../config/database/databaseDefinitions')

exports.up = function (knex) {
  return knex.schema.createTable(dbdf.table.requests.name, table => {
    table.string(dbdf.table.requests.field.id, 36).primary().notNullable()
    table.datetime(dbdf.table.requests.field.datetime, { useTz: true }).notNullable()
    table.time(dbdf.table.requests.field.runtime).notNullable()
    table.bigInteger(dbdf.table.requests.field.userId).notNullable()
    table.text(dbdf.table.requests.field.dataSend, 'mediumtext').nullable()
    table.text(dbdf.table.requests.field.dataReceived, 'mediumtext').nullable()
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable(REQUET_TABLE_NAME)
};
