import User from "../models/user.js";
import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "email-validator";
import Code from "../models/code.js";
import generateCode from "../utils/generateCode.js";
import sendMail from "../utils/nodeMailer.js";

dotenv.config();
const signup = async (req, res) => {
  const { fullName, emailAddress, password } = req.body;
  const hashedPassword = await bcrpyt.hash(password, 10);

  try {
    // Find if user is already registered
    const result = await User.find({ emailAddress: emailAddress });

    if (result.length === 1) {
      console.log("email already registered");
      // Already registered
      return res
        .status(200)
        .json({ status: "error", value: "Email address is already taken" });
    }

    console.log(validator.validate(emailAddress));
    // No existing email address
    if (!validator.validate(emailAddress)) {
      console.log("email not existing");
      return res
        .status(200)
        .json({ status: "error", value: "No existing email address found" });
    }

    // Register account
    await User.create({
      fullName,
      emailAddress,
      password: hashedPassword,
    });
    console.log("saved");
    return res.status(200).json({ status: "error", value: "User registered" });
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
  res.send("Error occurred");
};

const signin = async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    const user = await User.findOne({ emailAddress: emailAddress }).lean();

    // No registered email address
    if (!user) {
      console.log("invalid");
      return res.json({
        status: "error",
        value: "Invalid email address or password",
      });
    }

    // Password is correct
    if (await bcrpyt.compare(password, user.password)) {
      console.log("authenticated");

      const token = jwt.sign(
        { id: user._id, user: user.emailAddress },
        process.env.JWT_SECRET
      );

      return res.json({ status: "ok", value: token });
    }

    return res.json({
      status: "error",
      value: "Invalid email address or password",
    });
  } catch (error) {
    console.log(error);
    res.send("Error");
  }

  res.status(200).send("signin");
};

const forgotPassword = async (req, res) => {
  const { emailAddress } = req.body;
  try {
    const user = await User.findOne({ emailAddress: emailAddress }).lean();

    // No registered user
    if (!user) {
      console.log("no user found");
      return res.json({
        status: "error",
        value: "No registered email address found",
      });
    }

    // Generate 6-digit code
    const code = generateCode();

    await Code.create({ emailAddress, code, isValid: true });

    sendMail(emailAddress, code);
    console.log("code sent");
    return res
      .status(200)
      .json({ status: "ok", value: "Code sent to your email address" });
  } catch (error) {
    console.log(error);
  }
  res.status.json({
    status: "error",
    value: "Unexpected error occurs. Please try again",
  });
};

const confirmCode = async (req, res) => {
  const { emailAddress, code } = req.body;

  try {
    const userCode = await Code.findOne({ emailAddress, code }).lean();

    if (!userCode) {
      console.log("code incorrect");
      return res.json({ status: "error", value: "Code is incorrect" });
    }

    if (!userCode.isValid) {
      console.log("code expired");
      return res.json({ status: "error", value: "Code has already expired" });
    }

    return res.json({ status: "ok", value: "Code is valid" });
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    status: "error",
    value: "Unexpected error occurs. Please try again",
  });
};

export { signup, signin, forgotPassword, confirmCode };
