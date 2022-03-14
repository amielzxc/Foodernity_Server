import jwt from "jsonwebtoken";
import CallForDonation from "../models/callfordonation";
import ReleaseDonation from "../models/releasedonation.js";

const getAnnouncements = async (req, res) => {
  const { token } = req.body;

  try {
    //  jwt.verify(token, process.env.JWT_SECRET);

    const releasedDonations = ReleaseDonation.find();
    const releasedCallForDonations = CallForDonation.find({ donated: true });

    const combined = [...releasedDonations, ...releasedCallForDonations];

    console.log(combined);
    return res.json({ status: "error", value: "OK" });
  } catch (error) {
    console.log("error");
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export { getAnnouncements };
