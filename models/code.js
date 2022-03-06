import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true },
  code: { type: String, required: true },
  isValid: { type: Boolean, required: true },
});

export default mongoose.model("Code", codeSchema);
