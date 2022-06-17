import Event, { IEvent } from "../../models/event.model";

import { IEventResolver } from "../types/event.type";
import { PageRequest } from "../types/paged-request.type";

const toItemResponse = (event: IEvent | any = {}) => {
  if (!event) return null;

  const item = {
    type: event.type,
    dateTime: `${event.dateTime.toJSON()}`,
    aggregateId: event.aggregateId,
    data: JSON.stringify(event.data),
    metadata: JSON.stringify(event.metadata),
  };

  return item;
};

const getEvents = async (input: PageRequest) => {
  const { limit, offset, type, datetime } = PageRequest.normalize(input);

  const queryCount = Event.count();
  type && queryCount.where("type", type);
  queryCount.where("dateTime", { $gt: datetime });

  const queryItems = Event.find();
  queryItems.skip(offset);
  queryItems.limit(limit);
  queryItems.sort({ dateTime: -1 });

  type && queryItems.where("type", type);
  queryItems.where("dateTime", { $gt: datetime });

  const total = await queryCount.exec();
  const items = await queryItems.exec();

  const result = {
    total,
    items: items.map((event) => toItemResponse(event)),
  };

  return result;
};

const getEventById = async ({ id = "" }) => {
  const event = await Event.findOne({ aggregateId: id });
  return toItemResponse(event);
};

export { getEvents, getEventById };
