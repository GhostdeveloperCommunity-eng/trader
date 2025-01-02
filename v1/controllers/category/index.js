import { Router } from "express";
import { getCategories,insertCategories,uploadImage } from "./get.js";
import { categoryArraySchema } from "../../utils/schema.js";
import {hofSchemaValidation} from "../../utils/functions.js"
import { parseFormData } from "../../utils/functions.js";
import multer from "multer";
import multerS3 from "multer-s3"
import { S3Client } from "@aws-sdk/client-s3";


const router = new Router();
const storage = multer.memoryStorage()
const upload = multer({storage:storage})
router.post("/upload_Image",upload.array("image"),uploadImage)

router
.route("/")
.get( getCategories)
.post(upload.array("image"),parseFormData("items"),hofSchemaValidation(categoryArraySchema),insertCategories)


export default router;
