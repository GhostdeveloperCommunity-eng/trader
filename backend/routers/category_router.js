const express = require("express");
const router = express.Router();
const category = require("../controllers/category/category_handler");
const JwtService = require("../middleware/jwt");
const configs = require("../configs.json");
const ROLES = configs.CONSTANTS.ROLES;

router.post("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN]), category.createCategoryHandler);
router.put("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN]), category.updateCategoryHandler);
router.get("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN]), category.getAllCategoriesHandler);
router.get("/names", category.getCategoryNamesHandler);

module.exports = router;
