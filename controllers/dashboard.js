import Donation from "../models/donation.js";

const getstatistics = async (req, res) => {
  const { token } = req.body;

  try {
    //   jwt.verify(token, process.env.JWT_SECRET);

    getDonationCountPerStatus("Accepted");

    return res.json({ status: "ok", value: "ok" });
  } catch (error) {
    console.log(error);

    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const getDonationCountPerStatus = async (status) => {
  const donations = await Donation.find({
    donations: { $elemMatch: { status } },
  });

  console.log(donations);
};

export default getstatistics;
