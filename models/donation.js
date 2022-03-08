import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true },
  donationImage: { type: String, required: true },
  donationName: { type: String, required: true },
  donations: { type: Array, required: true },
  status: { type: String, required: true },
  donatedTo: { type: String, required: true },
});

export default mongoose.model("Donation", donationSchema);
