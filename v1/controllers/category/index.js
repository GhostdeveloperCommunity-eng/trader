import { Router } from "express";
import { getCategories } from "./get.js";

const router = new Router();

router.get("/", getCategories);

export default router;
