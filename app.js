
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import v1Router from "./v1/index.js";

const app = express();


app.use(cors("*"));

app.use(bodyParser.json());

app.use("/api/v1", v1Router);
// app.use("/api/v2", getCategoriesRouter);


export default app