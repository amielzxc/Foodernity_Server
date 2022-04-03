import Donation from "../models/donation.js";
import CallForDonation from "../models/callfordonation.js";
import User from "../models/user.js";

const getstatistics = async (req, res) => {
  const { token } = req.body;

  try {
    //   jwt.verify(token, process.env.JWT_SECRET);
    const statistics = {};

    statistics.pendingCount = await getDonationCountPerStatus(["Pending"]);
    statistics.acceptedCount = await getDonationCountPerStatus(["Accepted"]);

    statistics.activeCallForDonations = await callForDonations(["Active"]);

    statistics.completedCallForDonations = await callForDonations([
      "Completed",
    ]);

    statistics.activeUsers = await getUserPerStatus("Active");
    statistics.suspendedUsers = await getUserPerStatus("Suspended");
    statistics.stocksCount = await getCounts();

    return res.json({ status: "ok", value: statistics });
  } catch (error) {
    console.log(error);

    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const getDonationCountPerStatus = async (status) => {
  const allDonations = [];

  for (let i = 0; i < status.length; i++) {
    const donations = await Donation.find().where("status").all([status[i]]);
    allDonations.push(...donations);
  }

  return allDonations.length;
};

const callForDonations = async (status) => {
  const allCallForDonations = [];

  if (typeof status === "string") {
    const callfordonation = await CallForDonation.find()
      .where("status")
      .all([status]);
    allCallForDonations.push(...callfordonation);
  } else {
    for (let i = 0; i < status.length; i++) {
      const callfordonation = await CallForDonation.find()
        .where("status")
        .all([status[i]]);
      allCallForDonations.push(...callfordonation);
    }
  }

  return allCallForDonations.length;
};

const getUserPerStatus = async (status) => {
  const users = await User.find({ status });

  return users.length;
};

const getCounts = async () => {
  const donations = await Donation.find().select("donations");

  let categories = {
    "Canned Foods": {
      received: 0,
      donated: 0,
      balance: 0,
      category: "Canned Foods",
    },
    "Instant Noodles": {
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
      received: 0,
      donated: 0,
      balance: 0,
      category: "Canned Vegetables",
    },
    Eggs: { received: 0, donated: 0, balance: 0, category: "Eggs" },
    Rice: { received: 0, donated: 0, balance: 0, category: "Rice" },
    Cereals: {
      received: 0,
      donated: 0,
      balance: 0,
      category: "Cereals",
    },
    "Tea/Coffee/Milk/Sugar": {
      received: 0,
      donated: 0,
      balance: 0,
      category: "Tea/Coffee/Milk/Sugar",
    },
    Biscuits: {
      received: 0,
      donated: 0,
      balance: 0,
      category: "Biscuits",
    },
    "Condiments and Sauces": {
      received: 0,
      donated: 0,
      balance: 0,
      category: "Condiments and Sauces",
    },
    Beverages: {
      received: 0,
      donated: 0,
      balance: 0,
      category: "Beverages",
    },
    Snacks: {
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

  return Object.values(categories);
};

export default getstatistics;
