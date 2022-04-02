import mongoose from "mongoose";

const guidelineSchema = new mongoose.Schema({
  guideline: { type: String, required: true },
  description: { type: String, required: true },
  lastUpdated: { type: String, required: true },
});

export default mongoose.model("Guideline", guidelineSchema);
