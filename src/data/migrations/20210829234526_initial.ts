import { Knex } from "knex";
import { eventTable } from "../tables";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(eventTable.name, (table) => {
    table.string(eventTable.field.eventId, 36).primary().notNullable();
    table.datetime(eventTable.field.datetime, { useTz: true }).notNullable();

    table.string(eventTable.field.metadata, 255).nullable();
    table.string(eventTable.field.eventType, 255).nullable();
    table.text(eventTable.field.data, "longtext").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(eventTable.name);
}
