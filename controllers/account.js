import jwt from "jsonwebtoken";
import bcrpyt from "bcryptjs";
import User from "../models/user.js";
import Notification from "../models/notification.js";

// get user account
const getAccount = async (req, res) => {
  const { token } = req.body;

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ emailAddress: userToken.user });
    return res.json({ status: "ok", value: user });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

// update user account
const saveAccount = async (req, res) => {
  const { profilePicture, fullName, password, hidden, token } = req.body;

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrpyt.hash(password, 10);
    await User.findOneAndUpdate(
      { emailAddress: userToken.user },
      { profilePicture, fullName, password: hashedPassword, hidden }
    );

    return res.json({ status: "ok", value: "User successfully updated" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

// get user notifications
const getNotifications = async (req, res) => {
  const { token } = req.body;

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET);

    const notifications = await Notification.find({
      emailAddress: userToken.user,
    });

    return res.json({ status: "ok", value: notifications });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

// get all users for admin
const getUsers = async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const users = await User.find();

    return res.json({ status: "ok", value: users });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

// update user status for admin
const updateUserStatus = async (req, res) => {
  const { _id, newStatus, token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await User.findOneAndUpdate({ _id: _id }, { status: newStatus });

    return res.json({ status: "ok", value: "User updated" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};
export {
  getAccount,
  saveAccount,
  getNotifications,
  getUsers,
  updateUserStatus,
};
