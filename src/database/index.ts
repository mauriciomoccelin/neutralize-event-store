import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) throw new Error("No mongo uri provided");

mongoose.connect(mongoUri, { autoIndex: false });
export default mongoose;
