import { Router } from "express";
import categoryRouter from "./routes/categories/index.js";
import usersRouter from "./routes/users/index.js";

const router = new Router();

router.use("/categories", categoryRouter);
router.use("/users", usersRouter);
// router.use("/products", productRouter);
console.log("checking git");

export default router;
