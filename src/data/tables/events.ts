import uuid from "uuid";
import { Event } from "../../entities";

export default class EventTable {
  name = "events";
  
  field = {
    id: "id",
    payload: "payload",
    datetime: "datetime",
  };

  create(payload: string): Event {
    const event = new Event();
    event.id = uuid.v1();
    event.payload = payload;
    event.datetime = new Date().toJSON();

    return event;
  }
};