import express from "express";
import getstatistics from "../controllers/dashboard.js";

const router = express.Router();

router.route("/getstatistics").post(getstatistics);

export default router;
