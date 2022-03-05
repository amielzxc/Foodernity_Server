import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_DEV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", function (req, res) {
  res.send("Hello");
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_DEV} mode on port ${PORT}`)
);
