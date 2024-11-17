import { Router } from "express";
import categoryRouter from "./routes/categories/index.js";

const router = new Router();

router.use("/categories", categoryRouter);
// router.use("/products", productRouter);

export default router;
