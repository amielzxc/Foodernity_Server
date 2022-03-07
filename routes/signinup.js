import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  confirmCode,
  resetPassword,
} from "../controllers/signinup.js";

const router = express.Router();

router.route("/signup").post(signup);

router.route("/signin").post(signin);

router.route("/forgotpassword").post(forgotPassword);

router.route("/confirmcode").post(confirmCode);

router.route("/resetpassword").post(resetPassword);

export default router;
