import express from "express";
import masterProductRouter from "../../controllers/master_product/index.js";
import sellerProductRouter from "../../controllers/seller_Product/index.js";
import sellerLotsRouter from "../../controllers/seller_lots/index.js";
const router = express.Router();

router.use("/master_product", masterProductRouter);
router.use("/seller_product", sellerProductRouter);
router.use("/seller_lot", sellerLotsRouter);

export default router;
