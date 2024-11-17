import { Router } from "express";
import categoryController from "../../controllers/category/index.js";
const router = new Router();

router.use("/", categoryController);

export default router;
