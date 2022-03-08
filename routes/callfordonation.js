import express from "express";
import {
  createCallForDonation,
  getCallForDonations,
  updateCallForDonation,
} from "../controllers/callfordonation.js";

const router = express.Router();

router.route("/createcallfordonation").post(createCallForDonation);

router.route("/getcallfordonations").post(getCallForDonations);

router.route("/updatecallfordonation").post(updateCallForDonation);
export default router;
