import moment from "moment";
import Donation from "../models/donation.js";
import CallForDonation from "../models/callfordonation.js";
import ReleaseDonation from "../models/releasedonation.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// get stocks per status (e.g. Inventory)
const getStocksPerStatus = async (req, res) => {
  const { status, token } = req.body;

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
    console.log(categorized);
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

// release common donations
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

// release a call for donation
const releaseCallForDonation = async (req, res) => {
  const { _id, documentation, date, selected, token } = req.body;
  const selectedIds = selected.map((item) => item._id);

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await CallForDonation.findOneAndUpdate(
      { _id },
      {
        status: "Completed",
        donated: true,
        documentation,
        date,
      }
    );

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

const getCounts = async (req, res) => {
  const { token } = req.body;

  try {
    const donations = await Donation.find().select("donations");

    let categories = {
      "Canned Foods": {
        id: 1,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Canned Foods",
      },
      "Instant Noodles": {
        id: 2,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Instant Noodles",
      },
      "Canned Fruits": {
        id: 3,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Canned Fruits",
      },
      "Canned Vegetables": {
        id: 4,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Canned Vegetables",
      },
      Eggs: { id: 5, received: 0, donated: 0, balance: 0, category: "Eggs" },
      Rice: { id: 6, received: 0, donated: 0, balance: 0, category: "Rice" },
      Cereals: {
        id: 7,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Cereals",
      },
      "Tea/Coffee/Milk/Sugar": {
        id: 8,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Tea/Coffee/Milk/Sugar",
      },
      Biscuits: {
        id: 9,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Biscuits",
      },
      "Condiments and Sauces": {
        id: 10,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Condiments and Sauces",
      },
      Beverages: {
        id: 11,
        received: 0,
        donated: 0,
        balance: 0,
        category: "Beverages",
      },
      Snacks: {
        id: 12,
        received: 0,
        donated: 0,
        balance: 0,
        category: " Snacks",
      },
    };
    let filtered = [];

    for (let i = 0; i < donations.length; i++) {
      for (let j = 0; j < donations[i].donations.length; j++) {
        filtered.push(donations[i].donations[j]);
      }
    }

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i]["status"] !== "Unreceived") {
        categories[filtered[i]["foodCategory"]]["received"] =
          categories[filtered[i]["foodCategory"]]["received"] +
          Number(filtered[i]["quantity"]);
      }

      if (filtered[i]["status"] == "Inventory") {
        categories[filtered[i]["foodCategory"]]["balance"] =
          categories[filtered[i]["foodCategory"]]["balance"] +
          Number(filtered[i]["quantity"]);
      } else if (filtered[i]["status"] == "Donated") {
        categories[filtered[i]["foodCategory"]]["donated"] =
          categories[filtered[i]["foodCategory"]]["donated"] +
          Number(filtered[i]["quantity"]);
      }
    }

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i]["foodCategory"] == "Canned Foods") {
        console.log(filtered[i]);
      }
    }
    return res.json({ status: "ok", value: Object.values(categories) });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export {
  getStocksPerStatus,
  releaseDonations,
  releaseCallForDonation,
  getCounts,
};
