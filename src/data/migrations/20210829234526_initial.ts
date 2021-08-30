import { Knex } from "knex";
import { eventTable } from "../tables";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(eventTable.name, (table) => {
    table.string(eventTable.field.id, 36).primary().notNullable();
    table.datetime(eventTable.field.datetime, { useTz: true }).notNullable();
    table.text(eventTable.field.payload, "mediumtext");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(eventTable.name);
}
