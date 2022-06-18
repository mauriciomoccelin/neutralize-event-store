import database from "../database";

const Schema = database.Schema;
const Types = database.Schema.Types;

export interface IEvent extends database.Document {
  type: string;
  dateTime: Date;
  tenantId: string;
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
  tenantId: {
    ref: "Tenants",
    required: true,
    type: Types.ObjectId,
  },
  aggregateId: {
    required: true,
    type: Types.String,
  },
  data: {
    required: false,
    type: Types.Mixed,
  },
  metadata: {
    required: false,
    type: Types.Mixed,
  },
});

const Event = database.model<IEvent>("Events", EventSchema);
export default Event;
