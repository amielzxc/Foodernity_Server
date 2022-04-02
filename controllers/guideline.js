import jwt from "jsonwebtoken";
import Guideline from "../models/guideline.js";

const getGuidelines = async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const guidelines = await Guideline.find();

    return res.json({ status: "ok", value: guidelines });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const addGuideline = async (req, res) => {
  const { guideline, description, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const date = new Date();
    const lastUpdated =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    await Guideline.create({ guideline, description, lastUpdated });

    return res.json({ status: "ok", value: "Guideline added" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const editGuideline = async (req, res) => {
  const { _id, guideline, description, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const date = new Date();
    const lastUpdated =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    await Guideline.findByIdAndUpdate(_id, {
      guideline,
      description,
      lastUpdated,
    });

    return res.json({ status: "ok", value: "Guideline edited" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const deleteGuideline = async (req, res) => {
  const { _id, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await Guideline.findByIdAndDelete(_id);

    return res.json({ status: "ok", value: "Guideline deleted" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export { getGuidelines, addGuideline, editGuideline, deleteGuideline };
