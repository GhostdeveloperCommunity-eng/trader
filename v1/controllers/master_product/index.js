import express from "express";
import { createMasterProduct, getAllMasterProduct } from "./functions.js";
import { masterProductSchema } from "../../utils/schema.js";
import { hofSchemaValidation, authorizer } from "../../utils/functions.js";
const router = express.Router();

router
  .route("/")
  .post(
    authorizer,
    hofSchemaValidation(masterProductSchema),
    createMasterProduct
  )
  .get(authorizer, getAllMasterProduct);

export default router;
