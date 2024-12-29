import { Router } from "express";
import { getCategories,insertCategories } from "./get.js";
import { categoryArraySchema } from "../../utils/schema.js";
import {hofSchemaValidation} from "../../utils/functions.js"
const router = new Router();

router
.route("/")
.get( getCategories)
.post(hofSchemaValidation(categoryArraySchema),insertCategories)


export default router;
