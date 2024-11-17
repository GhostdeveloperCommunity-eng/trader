import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import v1Router from "./v1/index.js";

const app = express();
connectDB();

const corsOptions = {
  origin: (origin, callback) => {
    if (origin && /^http:\/\/localhost(:[0-9]+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors("*"));

app.use(bodyParser.json());

app.use("/api/v1/", v1Router);
// app.use("/api/v2", getCategoriesRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
