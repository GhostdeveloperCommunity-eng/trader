import express from "express";
import { hofSchemaValidation, authorizer } from "../../utils/functions.js";
import { sellerSchema } from "../../utils/schema.js";
import { createSeller } from "./functions.js";
const router = express.Router();

router
  .route("/")
  .post(authorizer, hofSchemaValidation(sellerSchema), createSeller);
export default router;

// const obj = {
//   aadharNumber: "16 digit",
//   gstNumber: "",
//   deliveryPin: ["", ""],

//   locations: [
//     {
//       adressLine1: "jhsfhjas",
//       adressLine2: "jhsfhjas",
//       pinCode: "",
//       latitude: 34.34,
//       longitude:74.23,
//     },
//   ],
// };
