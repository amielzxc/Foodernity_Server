import express from "express";
import {
  getAnnouncements,
  getDonations,
  getDonationsPerStatus,
  makeDonation,
  updateDonationStatus,
} from "../controllers/donation.js";

const router = express.Router();

router.route("/makedonation").post(makeDonation);

router.route("/getdonations").post(getDonations);

router.route("/getdonationsperstatus").post(getDonationsPerStatus);

router.route("/updatedonationstatus").post(updateDonationStatus);

router.route("/getannouncements").post(getAnnouncements);

export default router;
