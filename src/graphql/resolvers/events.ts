import Event, { IEvent } from "../../models/event.model";

class PageRequest {
  limit!: number;
  offset!: number;
  type?: string;
  datetime!: string;

  static normalize(input: PageRequest): PageRequest {
    const maxItemsResult = 10;

    input.datetime = new Date(input.datetime).toJSON();
    input.offset = input.offset <= 0 ? 1 : input.offset;
    input.limit = input.limit > maxItemsResult ? maxItemsResult : input.limit;

    return input;
  }
}

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

const newEvent = async (input: IEvent) => {
  const event = new Event(input);
  await event.save();
  return true;
};

export { newEvent, getEvents, getEventById };
