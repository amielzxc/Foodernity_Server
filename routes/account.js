import express from "express";
import {
  getAccount,
  getNotifications,
  getUsers,
  saveAccount,
  updateUserStatus,
} from "../controllers/account.js";

const router = express.Router();

router.route("/getaccount").post(getAccount);

router.route("/saveaccount").post(saveAccount);

router.route("/getnotifications").post(getNotifications);

router.route("/getusers").post(getUsers);

router.route("/updateuserstatus").post(updateUserStatus);

export default router;
