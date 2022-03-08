import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
});

export default mongoose.model("Notification", notificationSchema);
