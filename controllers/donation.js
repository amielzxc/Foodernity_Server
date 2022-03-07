import jwt from "jsonwebtoken";
import Donation from "../models/donation.js";
const makeDonation = async (req, res) => {
  const {
    donationImage,
    donationName,
    foodCategories,
    quantities,
    expiryDates,
    token,
  } = req.body;
  let emailAddress;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    let donations = [];

    if (typeof foodCategories == "string") {
      donations.push({
        foodCategory: foodCategories,
        quantity: quantities,
        expiryDate: expiryDates,
      });
    } else {
      for (let i = 0; i < foodCategories.length; i++) {
        donations.push({
          foodCategory: foodCategories[i],
          quantity: quantities[i],
          expiryDate: expiryDates[i],
        });
      }
    }

    await Donation.create({
      emailAddress: user.user,
      donationImage,
      donationName,
      donations,
      status: "Pending",
    });

    return res.json({ status: "ok", value: "Successfully made a donation" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const getDonations = async (req, res) => {
  const { token } = req.body;

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET);

    const donations = await Donation.find({ emailAddress: userToken.user });

    return res.json({ status: "ok", value: donations });
  } catch (error) {
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export { makeDonation, getDonations };
