import express from "express";
import {
  addGuideline,
  deleteGuideline,
  editGuideline,
  getGuidelines,
} from "../controllers/guideline.js";

const router = express.Router();

router.route("/getguidelines").post(getGuidelines);

router.route("/addguideline").post(addGuideline);

router.route("/editguideline").post(editGuideline);

router.route("/deleteguideline").post(deleteGuideline);

export default router;
