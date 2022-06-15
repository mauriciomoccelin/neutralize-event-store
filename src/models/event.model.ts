import database from "../database";

const Schema = database.Schema;
const Types = database.Schema.Types;

export interface IEvent extends database.Document {
  type: string;
  dateTime: Date;
  aggregateId: string;
  data: any | null;
  metadata: Array<any> | null;
}

const EventSchema = new Schema({
  type: {
    required: true,
    type: Types.String,
  },
  dateTime: {
    required: true,
    type: Types.Date,
  },
  aggregateId: {
    required: true,
    type: Types.String,
  },
  data: {
    required: false,
    type: Types.Subdocument,
  },
  metadata: {
    required: false,
    type: Types.Subdocument,
  },
});

const Event = database.model<IEvent>("events", EventSchema);
export default Event;
