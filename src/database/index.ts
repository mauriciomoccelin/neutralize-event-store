import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/event-store';
if (!mongoUri) throw new Error("No mongo uri provided");

mongoose.connect(mongoUri);
export default mongoose;
