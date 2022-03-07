import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },
  method: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
