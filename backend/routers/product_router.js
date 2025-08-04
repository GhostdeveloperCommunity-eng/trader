const express = require("express");
const router = express.Router();
const product = require("../controllers/product/product_handler");
const JwtService = require("../middleware/jwt");
const configs = require("../configs.json");
const ROLES = configs.CONSTANTS.ROLES;

router.post("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN, ROLES.SELLER]), product.createProductHandler);
router.put("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN, ROLES.SELLER]), product.updateProductHandler);
router.get("/", product.getProductHandler);

module.exports = router;
