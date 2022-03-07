import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import env from "dotenv";
import signinupRouter from "./routes/signinup.js";
import donationRouter from "./routes/donation.js";
import connectDB from "./database/connect.js";

const app = express();
env.config();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(signinupRouter);
app.use(donationRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(
      PORT,
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  } catch (err) {
    console.log(err);
  }
};

startServer();
