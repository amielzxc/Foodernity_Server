import jwt from "jsonwebtoken";
import CallForDonation from "../models/callfordonation.js";

const createCallForDonation = async (req, res) => {
  const { title, beneficiaries, remarks, image, status, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await CallForDonation.create({
      title,
      beneficiaries,
      remarks,
      image,
      status,
      donated: false,
      required: "",
    });
    return res.json({ status: "ok", value: "Call for donation created." });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const getCallForDonations = async (req, res) => {
  const { status, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

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

    return res.json({ status: "ok", value: allCallForDonations });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const updateCallForDonation = async (req, res) => {
  const { _id, newStatus, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await CallForDonation.findByIdAndUpdate(_id, { status: newStatus });

    res.json({ status: "ok", value: "Call for donation updates" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export { createCallForDonation, getCallForDonations, updateCallForDonation };
