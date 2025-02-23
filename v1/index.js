import { Router } from "express";
import categoryRouter from "./routes/categories/index.js";
import usersRouter from "./routes/users/index.js";
import productRouter from "./routes/products/index.js";

const router = new Router();

router.use("/categories", categoryRouter);
router.use("/users", usersRouter);
router.use("/products", productRouter);

export default router;
