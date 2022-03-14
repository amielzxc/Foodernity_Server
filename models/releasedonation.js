import mongoose from "mongoose";

const releaseDonationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  beneficiaries: { type: String, required: true },
  remarks: { type: String, required: true },
  donated: { type: Boolean, required: true },
  documentation: { type: String, required: true },
  date: { type: String, required: true },
});

export default mongoose.model("ReleaseDonation", releaseDonationSchema);
