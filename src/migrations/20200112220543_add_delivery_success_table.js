const dbdf = require('../config/database/definition')

exports.up = function(knex) {
  return knex.schema.createTable(dbdf.table.deliverySuccess.name, table => {
    table.string(dbdf.table.deliverySuccess.field.id, 36).primary().notNullable()
    table.datetime(dbdf.table.deliverySuccess.field.datetime, { useTz: true }).notNullable()
    table.string(dbdf.table.deliverySuccess.field.topic, 255)
    table.string(dbdf.table.deliverySuccess.field.offset, 19)
    table.string(dbdf.table.deliverySuccess.field.partitionOffset, 19)
    table.text(dbdf.table.deliverySuccess.field.message, 'mediumtext')

    table.index([dbdf.table.deliverySuccess.field.topic, dbdf.table.deliverySuccess.field.datetime], 'IX_topic_datetime')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable(dbdf.table.deliverySuccess.name)
};
