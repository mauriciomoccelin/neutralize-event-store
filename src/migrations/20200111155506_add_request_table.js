const dbdf = require('../config/database/definition')

exports.up = function (knex) {
  return knex.schema.createTable(dbdf.table.request.name, table => {
    table.string(dbdf.table.request.field.id, 36).primary().notNullable()
    table.string(dbdf.table.request.field.identifier, 255).notNullable()
    table.time(dbdf.table.request.field.runtime).notNullable()
    table.datetime(dbdf.table.request.field.datetime, { useTz: true }).notNullable()
    table.string(dbdf.table.request.field.userAgent).notNullable()
    table.text(dbdf.table.request.field.request, 'mediumtext').nullable()
    table.text(dbdf.table.request.field.response, 'mediumtext').nullable()

    table.index([dbdf.table.request.field.identifier, dbdf.table.request.field.datetime], 'IX_identifier_datetime')
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable(dbdf.table.request.name)
};
