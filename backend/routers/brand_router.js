const express = require("express");
const router = express.Router();
const brand = require("../controllers/brand/brand_handler");
const JwtService = require("../middleware/jwt");
const configs = require("../configs.json");
const ROLES = configs.CONSTANTS.ROLES;

router.post("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN]), brand.createBrandHandler);
router.put("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN]), brand.updateBrandHandler);
router.get("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN]), brand.getAllBrandsHandler);
router.get("/names", brand.getBrandNamesHandler);

module.exports = router;
