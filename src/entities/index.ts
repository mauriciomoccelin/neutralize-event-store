export class PageRequest {
  limit!: number;
  offset!: number;
  search?: string;
  datetime!: string;
}

export class Event {
  id!: string;
  payload!: string;
  datetime!: string;
}