import express from "express";
import { getAccount, saveAccount } from "../controllers/account.js";

const router = express.Router();

router.route("/getaccount").post(getAccount);

router.route("/saveaccount").post(saveAccount);

export default router;
