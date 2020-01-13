const dbdf = require('../config/database/definition')

exports.up = function(knex) {
  return knex.schema.createTable(dbdf.table.deliveryFailed.name, table => {
    table.string(dbdf.table.deliveryFailed.field.id, 36).primary().notNullable()
    table.datetime(dbdf.table.deliveryFailed.field.datetime, { useTz: true }).notNullable()
    table.string(dbdf.table.deliveryFailed.field.topic, 255)
    table.string(dbdf.table.deliveryFailed.field.error, 255)
    table.text(dbdf.table.deliveryFailed.field.message, 'mediumtext')

    table.index([dbdf.table.deliveryFailed.field.topic, dbdf.table.deliveryFailed.field.datetime], 'IX_topic_datetime')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable(dbdf.table.deliveryFailed.name)
};
