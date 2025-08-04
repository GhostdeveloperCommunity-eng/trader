const express = require("express");
const router = express.Router();
const master = require("../controllers/master/master_handler");
const JwtService = require("../middleware/jwt");
const configs = require("../configs.json");
const ROLES = configs.CONSTANTS.ROLES;

router.post("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN, ROLES.SELLER]), master.createMasterHandler);
router.put("/", JwtService.validateJwt, JwtService.validateRole([ROLES.ADMIN, ROLES.SELLER]), master.updateMasterHandler);
router.get("/", JwtService.validateJwt, master.getAllMasterHandler);

module.exports = router;
