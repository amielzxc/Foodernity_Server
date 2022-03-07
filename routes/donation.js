import express from "express";
import { getDonations, makeDonation } from "../controllers/donation.js";

const router = express.Router();

router.route("/makedonation").post(makeDonation);

router.route("/getdonations").post(getDonations);

export default router;
