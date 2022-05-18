import Event, { IEvent } from "../../models/event.model";

interface IPageRequest {
  limit: number;
  offset: number;
  type?: string;
  datetime: string;
}

const getEvents = async (input: IPageRequest) => {
  const { limit, offset, type, datetime } = input;

  const queryCount = Event.count();

  type && queryCount.where("type", type);
  type && queryCount.where("dateTime", { $gte: datetime });

  const queryItems = Event.find();

  type && queryCount.where("type", type);
  type && queryCount.where("dateTime", { $gte: datetime });

  limit > 30 ? queryItems.limit(30) : queryItems.limit(limit);

  queryCount.skip(offset);
  queryCount.sort({ dateTime: -1 });

  const total = await queryCount.exec();
  const items = await queryItems.exec();

  const result = {
    total,
    items: items.map((item) => ({
      type: item.type,
      dateTime: `${item.dateTime.toJSON()}`,
      aggregateId: item.aggregateId,
      data: JSON.stringify(item.data),
      metadata: JSON.stringify(item.metadata),
    })),
  };

  console.log(result);

  return result;
};

const getEventById = async ({ id = "" }) => {
  const event = await Event.findById({ _id: id, aggregateId: id });
  return event;
};

const newEvent = async (input: IEvent) => {
  const event = new Event(input);
  await event.save();
  return true;
};

export { newEvent, getEvents, getEventById };
