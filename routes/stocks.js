import express from "express";
import {
  getStocksPerStatus,
  releaseCallForDonation,
  releaseDonations,
} from "../controllers/stocks.js";

const router = express.Router();

router.route("/getstocksperstatus").post(getStocksPerStatus);

router.route("/releasedonations").post(releaseDonations);

router.route("/releasecallfordonation").post(releaseCallForDonation);

export default router;
