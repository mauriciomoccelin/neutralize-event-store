const dbdf = require('../config/database/definition')

exports.up = function (knex) {
  return knex.schema.createTable(dbdf.table.integration.name, table => {
    table.string(dbdf.table.integration.field.id, 36).primary().notNullable()
    table.datetime(dbdf.table.integration.field.datetime, { useTz: true }).notNullable()
    table.time(dbdf.table.integration.field.runtime).notNullable()
    table.bigInteger(dbdf.table.integration.field.userId)
    table.text(dbdf.table.integration.field.dataSend, 'mediumtext')
    table.text(dbdf.table.integration.field.dataReceived, 'mediumtext')

    table.index([dbdf.table.integration.field.userId, dbdf.table.integration.field.datetime], 'IX_user_id_datetime')
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable(dbdf.table.integration.name)
};
