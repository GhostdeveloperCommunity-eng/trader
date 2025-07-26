import express from "express";
import { createMasterProduct, getAllMasterProduct } from "./functions.js";
// import { masterProductSchema } from "../../utils/schema.js";
import { hofSchemaValidation, authorizer } from "../../utils/functions.js";
import Joi from "joi";
const router = express.Router();

export const masterProductSchema = Joi.object({
  skuCode: Joi.string().required(),
  name: Joi.string().required(),
  categoryId: Joi.string().required(),
  brand: Joi.string().allow(""),
  productSubCategory: Joi.string().allow(""),
  size: Joi.string().allow(""),
  mrp: Joi.number().positive().empty(''),
  images: Joi.array().items(Joi.string()).min(1).required(),
  active: Joi.boolean().optional(),
});

router
  .route("/")
  .post(
    authorizer,
    hofSchemaValidation(masterProductSchema),
    createMasterProduct
  )
  .get(authorizer, getAllMasterProduct);

export default router;
