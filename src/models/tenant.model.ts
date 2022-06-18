import bcrypt from "bcryptjs";
import database from "../database";

const Schema = database.Schema;
const Types = database.Schema.Types;

export interface ITenant extends database.Document {
  createAt: Date;
  updatedAt: Date;
  email: string;
  secret: string;
  description: string;
}

const TenantSchema = new Schema({
  description: {
    required: true,
    type: Types.String,
  },
  createAt: {
    required: true,
    type: Types.Date,
    default: Date.now,
  },
  updateAt: {
    required: false,
    type: Types.Date,
    default: null,
  },
  email: {
    unique: true,
    required: true,
    type: Types.String,
    set: (email: string) => email.toLowerCase(),
  },
  secret: {
    select: false,
    required: true,
    type: Types.String,
  },
});

TenantSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.secret, 10);
  this.secret = hash;

  next();
});

const Tenant = database.model<ITenant>("Tenants", TenantSchema);
export default Tenant;
