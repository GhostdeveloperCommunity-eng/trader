
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import v1Router from "./v1/index.js";

const app = express();
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

app.use("/api/v1", v1Router);
// app.use("/api/v2", getCategoriesRouter);


export default app