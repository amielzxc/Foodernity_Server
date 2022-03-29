import express from "express";
import {
  getCounts,
  getStocksPerStatus,
  releaseCallForDonation,
  releaseDonations,
} from "../controllers/stocks.js";

const router = express.Router();

router.route("/getstocksperstatus").post(getStocksPerStatus);

router.route("/releasedonations").post(releaseDonations);

router.route("/releasecallfordonation").post(releaseCallForDonation);

router.route("/getcounts").post(getCounts);

export default router;
