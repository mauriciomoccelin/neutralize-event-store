export class IEventInput {
  type!: string;
  dateTime!: Date;
  aggregateId!: string;
  data?: string;
  metadata?: string;
}

export interface IEventResolver {
  input: IEventInput;
}
