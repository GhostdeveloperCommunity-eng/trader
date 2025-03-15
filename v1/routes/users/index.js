import { Router } from "express";
import userLoginRouter from "../../controllers/users/loginusers.js";
import sellerRouter from "../../controllers/sellers/index.js";

const router = new Router();

router.use("/login", userLoginRouter);
router.use("/seller", sellerRouter);

export default router;
