import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import env from "dotenv";
import helmet from "helmet";
import signinupRouter from "./routes/signinup.js";
import donationRouter from "./routes/donation.js";
import accountRouter from "./routes/account.js";
import callfordonationRouter from "./routes/callfordonation.js";
import stocksRouter from "./routes/stocks.js";
import connectDB from "./database/connect.js";

const app = express();
env.config();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet.frameguard());

app.use(cors({ origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello from Stack over flowers");
});
app.use(signinupRouter);
app.use(donationRouter);
app.use(accountRouter);
app.use(callfordonationRouter);
app.use(stocksRouter);

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
