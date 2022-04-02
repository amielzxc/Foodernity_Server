import jwt from "jsonwebtoken";
import FAQ from "../models/faq.js";

const getQuestions = async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const questions = await FAQ.find();

    return res.json({ status: "ok", value: questions });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const addQuestion = async (req, res) => {
  const { question, answer, token } = req.body;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const date = new Date();
    const lastUpdated =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    await FAQ.create({ question, answer, lastUpdated });

    return res.json({ status: "ok", value: "Question created" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const editQuestion = async (req, res) => {
  const { _id, question, answer, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const date = new Date();
    const lastUpdated =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    await FAQ.findByIdAndUpdate(_id, { question, answer, lastUpdated });

    return res.json({ status: "ok", value: "Question edited" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

const deleteQuestion = async (req, res) => {
  const { _id, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await FAQ.findByIdAndDelete(_id);

    return res.json({ status: "ok", value: "Question deleted" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

export { getQuestions, addQuestion, editQuestion, deleteQuestion };
