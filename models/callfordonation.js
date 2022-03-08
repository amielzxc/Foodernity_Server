import mongoose from "mongoose";

const callfordonationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  beneficiaries: { type: String, required: true },
  remarks: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, required: true },
});

export default mongoose.model("CallForDonation", callfordonationSchema);
