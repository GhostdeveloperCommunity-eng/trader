import express from "express";
import { authorizer } from "../../utils/functions.js";
import { hofSchemaValidation } from "../../utils/functions.js";
import { lotSchema } from "./schema.js";
import { createLot } from "./functions.js";
const router = express.Router();

router.route("/").post(authorizer, hofSchemaValidation(lotSchema), createLot);

router.route("/:lotId").patch();

export default router;
