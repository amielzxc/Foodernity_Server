import jwt from "jsonwebtoken";
import Donation from "../models/donation.js";
import Notification from "../models/notification.js";
import ReleaseDonation from "../models/releasedonation.js";
import CallForDonation from "../models/callfordonation.js";
import mongoose from "mongoose";
import User from "../models/user.js";

// make a donation for donor
const makeDonation = async (req, res) => {
  const {
    donationImage,
    donationName,
    foodCategories,
    quantities,
    expiryDates,
    donatedTo,
    token,
  } = req.body;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    let donations = [];

    if (typeof foodCategories == "string") {
      donations.push({
        foodCategory: foodCategories,
        quantity: quantities,
        expiryDate: expiryDates,
        status: "Unreceived",
        donatedTo,
      });
    } else {
      for (let i = 0; i < foodCategories.length; i++) {
        donations.push({
          foodCategory: foodCategories[i],
          quantity: quantities[i],
          expiryDate: expiryDates[i],
          status: "Unreceived",
          donatedTo,
        });
      }
    }

    const findUser = await User.findOne({ emailAddress: user.user });
    console.log(findUser);
    await Donation.create({
      emailAddress: user.user,
      fullName: findUser.fullName,
      hidden: findUser.hidden,
      donationImage,
      donationName,
      donations,
      status: "Pending",
      donatedTo,
    });

    return res.json({ status: "ok", value: "Successfully made a donation" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

// get donations for specific donor
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

// get all donations filtered by status for admin
const getDonationsPerStatus = async (req, res) => {
  const { status, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const allDonations = [];

    for (let i = 0; i < status.length; i++) {
      const donations = await Donation.find().where("status").all([status[i]]);
      allDonations.push(...donations);
    }

    return res.json({ status: "ok", value: allDonations });
  } catch (error) {
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

// update status of donation by admin
const updateDonationStatus = async (req, res) => {
  const { _id, newStatus, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const result = await Donation.findByIdAndUpdate(_id, { status: newStatus });

    let message = "";

    if (newStatus === "Accepted") {
      message = `Your donation ${result.donationName} has been accepted.`;
    } else if (newStatus === "Declined") {
      message = `Your donation ${result.donationName} has been declined.`;
    } else if (newStatus === "Received") {
      message = `Your donation ${result.donationName} has been received.`;
      console.log("to inventory");
      await Donation.updateOne(
        { _id },
        {
          $set: { "donations.$[elem].status": "Inventory" },
        },
        { arrayFilters: [{ "elem.status": "Unreceived" }] }
      );
    } else {
      message = `Your donation ${result.donationName} has been donated.`;
    }

    await Notification.create({
      emailAddress: result.emailAddress,
      status: newStatus,
      message,
    });

    return res.json({ status: "ok", value: "Donation status updated." });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const getAnnouncements = async (req, res) => {
  const { token } = req.body;

  try {
    //  jwt.verify(token, process.env.JWT_SECRET);

    const releasedDonations = await ReleaseDonation.find();
    const releasedCallForDonations = await CallForDonation.find({
      donated: true,
    });

    const combined = [...releasedDonations, ...releasedCallForDonations];

    for (let i = 0; i < combined.length; i++) {
      let result = await Donation.aggregate([
        { $unwind: "$donations" },
        {
          $match: {
            "donations.donatedTo": combined[i]._id.toString(),
          },
        },
      ]);

      combined[i] = { ...combined[i].toJSON(), itemsDonated: result };
    }

    return res.json({ status: "ok", value: combined });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export {
  makeDonation,
  getDonations,
  getDonationsPerStatus,
  updateDonationStatus,
  getAnnouncements,
};
