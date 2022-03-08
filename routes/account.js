import express from "express";
import {
  getAccount,
  getNotifications,
  saveAccount,
} from "../controllers/account.js";

const router = express.Router();

router.route("/getaccount").post(getAccount);

router.route("/saveaccount").post(saveAccount);

router.route("/getnotifications").post(getNotifications);

export default router;
