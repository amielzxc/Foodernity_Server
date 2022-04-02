import express from "express";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "../controllers/faq.js";

const router = express.Router();

router.route("/getquestions").post(getQuestions);

router.route("/addquestion").post(addQuestion);

router.route("/editquestion").post(editQuestion);

router.route("/deletequestion").post(deleteQuestion);

export default router;
