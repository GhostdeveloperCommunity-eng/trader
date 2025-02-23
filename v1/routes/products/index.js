import express from "express";
import masterProductRouter from "../../controllers/master_product/index.js";
import sellerProductRouter from "../../controllers/seller_Product/index.js";
const router = express.Router();

router.use("/master_product", masterProductRouter);
router.use("/seller_product", sellerProductRouter);

export default router;
