import express from "express";
import { makeDonation } from "../controllers/donation.js";

const router = express.Router();

router.route("/makedonation").post(makeDonation);

export default router;
