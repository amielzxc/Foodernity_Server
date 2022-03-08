import jwt from "jsonwebtoken";
import bcrpyt from "bcryptjs";
import User from "../models/user.js";
import Notification from "../models/notification.js";

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

const saveAccount = async (req, res) => {
  const { profilePicture, fullName, password, token } = req.body;

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrpyt.hash(password, 10);
    await User.findOneAndUpdate(
      { emailAddress: userToken.user },
      { profilePicture, fullName, password: hashedPassword }
    );

    return res.json({ status: "ok", value: "User successfully updated" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", value: "Unauthorized token." });
  }
};

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
export { getAccount, saveAccount, getNotifications };
