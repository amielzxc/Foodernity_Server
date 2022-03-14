import moment from "moment";
import Donation from "../models/donation.js";
import CallForDonation from "../models/callfordonation.js";
import ReleaseDonation from "../models/releasedonation.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const getStocksPerStatus = async (req, res) => {
  const { token } = req.body;
  const status = "Inventory";
  const dateToday = moment();
  let generateId = 1;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const donations = await Donation.find({
      donations: { $elemMatch: { status } },
    });

    const callForDonations = await CallForDonation.find({ donated: false });

    const categorized = {
      commonDonations: {
        _id: "",
        title: "Common Donations",
        items: [],
      },
    };

    for (let item of callForDonations) {
      categorized[item._id] = { _id: item._id, title: item.title, items: [] };
    }

    for (let i = 0; i < donations.length; i++) {
      for (let j = 0; j < donations[i].donations.length; j++) {
        const item = donations[i].donations[j];
        if (item.status === "Donated") continue;

        const expiry = moment(item.expiryDate, "MM-DD-YYYY");
        const daysLeft = expiry.diff(dateToday, "days");

        let modifiedItems = {
          id: generateId,
          emailAddress: donations[i].emailAddress,
          donationName: donations[i].donationName,
          foodCategory: item.foodCategory,
          quantity: item.quantity,
          expiryDate: item.expiryDate,
          status: item.status,
          donatedTo: item.donatedTo,
          daysLeft,
          _id: item.id,
        };
        if (item.donatedTo === "Common Donation") {
          categorized["commonDonations"]["items"].push(modifiedItems);
        } else {
          categorized[item.donatedTo]["items"].push(modifiedItems);
        }
        generateId++;
      }
    }

    return res.json({ status: "ok", value: categorized });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const releaseDonations = async (req, res) => {
  const {
    title,
    beneficiaries,
    remarks,
    donated,
    documentation,
    date,
    selected,
    token,
  } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const released = await ReleaseDonation.create({
      title,
      beneficiaries,
      remarks,
      donated,
      documentation,
      date,
    });

    let itemsToBeUpdated = [];

    for (let i = 0; i < selected.length; i++) {
      const result = await Donation.aggregate([
        { $unwind: "$donations" },
        {
          $match: {
            "donations._id": mongoose.Types.ObjectId(selected[i]),
          },
        },
      ]);
      itemsToBeUpdated.push(...result);
    }

    for (let i = 0; i < itemsToBeUpdated.length; i++) {
      const item = itemsToBeUpdated[i];
      await Donation.updateOne(
        { _id: item._id },
        {
          $set: {
            "donations.$[elem].status": "Donated",
            "donations.$[elem].donatedTo": released._id,
          },
        },
        {
          arrayFilters: [
            { "elem._id": mongoose.Types.ObjectId(item.donations._id) },
          ],
        }
      );
    }

    res.json({ status: "ok", value: "Donations released" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const releaseCallForDonation = async (req, res) => {
  const { _id, documentation, date, selected, token } = req.body;
  const selectedIds = selected.map((item) => item._id);

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await CallForDonation.findOneAndUpdate(_id, {
      status: "Completed",
      donated: true,
      documentation,
      date,
    });

    let itemsToBeUpdated = [];

    for (let i = 0; i < selectedIds.length; i++) {
      const result = await Donation.aggregate([
        { $unwind: "$donations" },
        {
          $match: {
            "donations._id": mongoose.Types.ObjectId(selectedIds[i]),
          },
        },
      ]);
      itemsToBeUpdated.push(...result);
    }

    for (let i = 0; i < itemsToBeUpdated.length; i++) {
      const item = itemsToBeUpdated[i];
      await Donation.updateOne(
        { _id: item._id },
        {
          $set: {
            "donations.$[elem].status": "Donated",
          },
        },
        {
          arrayFilters: [
            { "elem._id": mongoose.Types.ObjectId(item.donations._id) },
          ],
        }
      );
    }

    return res.json({ status: "ok", value: "Call for Donations released" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export { getStocksPerStatus, releaseDonations, releaseCallForDonation };
