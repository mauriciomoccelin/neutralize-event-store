import db from "../../data/connection";
import { eventTable } from "../../data/tables";
import { Event, PageRequest } from "../../entities";

const getEvents = async (input: PageRequest) => {
  let totalResult = await db(eventTable.name)
    .count(eventTable.field.eventId, { as: "total" })
    .where(eventTable.field.datetime, ">=", input.datetime)
    .andWhere((builder: any) => {
      if (input.search) {
        builder.where(eventTable.field.metadata, "like", `${input.search}%`);
        builder.where(eventTable.field.eventType, "like", `${input.search}%`);
      } else builder.where(1, 1);
    });

  let itensResult = await db(eventTable.name)
    .column(eventTable.field)
    .where(eventTable.field.datetime, ">", input.datetime)
    .andWhere((builder: any) => {
      if (input.search) {
        builder.where(eventTable.field.metadata, "like", `${input.search}%`);
        builder.where(eventTable.field.eventType, "like", `${input.search}%`);
      } else builder.where(1, 1);
    })
    .orderBy(eventTable.field.datetime, "desc")
    .limit(input.limit)
    .offset(input.limit * (input.offset - 1));

  return {
    itens: itensResult,
    total: totalResult[0]["total"] || 0,
  };
};

const getEventById = async ({ id = 0 }) => {
  return await db(eventTable.name)
    .columns.where({ [eventTable.field.eventId]: id })
    .first();
};

const newEvent = async (input: Event) => {
  input.setEventId();
  input.setDatetime();

  await db(eventTable.name).insert(input).table(eventTable.name);

  return true;
};

export { newEvent, getEvents, getEventById };
