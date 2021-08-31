import { v4 as uuidv4 } from 'uuid';

export class PageRequest {
  limit!: number;
  offset!: number;
  search?: string;
  datetime!: string;
}

export class Event {
  eventId!: string;
  eventType?: string;
  data?: string;
  metadata?: string;
  datetime!: string;

  constructor(
    eventId: string,
    eventType: string,
    data: string,
    metadata: string,
    datetime: string
  ) {
    this.eventId! = eventId;
    this.eventType = eventType;
    this.data = data;
    this.metadata = metadata;
    this.datetime = datetime;
  }

  public setEventId() {
    this.eventId = uuidv4();
  }

  public setDatetime() {
    this.datetime = new Date().toJSON();
  }
}
