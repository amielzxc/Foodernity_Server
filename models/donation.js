import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true },
  donationImage: { type: String, required: true },
  donationName: { type: String, required: true },
  donations: {
    type: [
      {
        foodCategory: { type: String, required: true },
        quantity: { type: String, required: true },
        expiryDate: { type: String, required: true },
        status: { type: String, required: true },
        donatedTo: { type: String, required: true },
      },
    ],
    required: true,
  },
  status: { type: String, required: true },
});

export default mongoose.model("Donation", donationSchema);
