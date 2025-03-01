import express from "express";
import { authorizer } from "../../utils/functions";
import { hofSchemaValidation } from "../../utils/functions";
import { lotSchema } from "./schema.js";
import { createLot } from "./functions.js";
const router = express.Router();

router.route("/").post(authorizer, hofSchemaValidation(lotSchema), createLot);

export default router;
