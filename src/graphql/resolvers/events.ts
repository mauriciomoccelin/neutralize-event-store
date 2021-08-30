import uuid from "uuid";
import db from "../../data/connection";
import { eventTable } from "../../data/tables";
import { Event, PageRequest } from "../../entities";

const getOffset = (input: PageRequest) => input.limit * (input.offset - 1);

const getEvents = async (input: PageRequest) => {
  let totalResult = await db(eventTable.name)
    .count(eventTable.field.id, { as: "total" })
    .where(eventTable.field.datetime, ">", input.datetime)
    .andWhere((builder: any) => {
      if (input.search) {
        builder.where(eventTable.field.payload, "like", `${input.search}%`);
      } else builder.where(1, 1);
    });

  let itensResult = await db(eventTable.name)
    .column(eventTable.field)
    .where(eventTable.field.datetime, ">", input.datetime)
    .andWhere((builder: any) => {
      if (input.search) {
        builder.where(eventTable.field.payload, "like", `${input.search}%`);
      } else builder.where(1, 1);
    })
    .orderBy(eventTable.field.datetime, "desc")
    .limit(input.limit)
    .offset(getOffset(input));

  return {
    itens: itensResult,
    total: totalResult[0]["total"] || 0,
  };
};

const getEventById = async ({ id = 0 }) => {
  return await db(eventTable.name)
    .columns
    .where({ [eventTable.field.id]: id })
    .first();
};

const newEvent = async (input: Event) => {
  input.id = uuid.v1();
  await db(eventTable.name).insert(input).table(eventTable.name);
  return true;
};

export { newEvent, getEvents, getEventById };
