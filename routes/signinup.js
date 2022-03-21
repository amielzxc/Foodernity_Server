import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  confirmCode,
  resetPassword,
  authenticate,
} from "../controllers/signinup.js";

const router = express.Router();

router.route("/signup").post(signup);

router.route("/signin").post(signin);

router.route("/forgotpassword").post(forgotPassword);

router.route("/confirmcode").post(confirmCode);

router.route("/resetpassword").post(resetPassword);

router.route("/authenticate").post(authenticate);

export default router;
