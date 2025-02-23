import express from "express";
import { createSellerProduct } from "./functions.js";
import { authorizer, hofSchemaValidation } from "../../utils/functions.js";
import { sellerProductSchema } from "../../utils/schema.js";
const router = express.Router(createSellerProduct);

router
  .route("/")
  .post(
    authorizer,
    hofSchemaValidation(sellerProductSchema),
    createSellerProduct
  )
  .get(authorizer);

export default router;
