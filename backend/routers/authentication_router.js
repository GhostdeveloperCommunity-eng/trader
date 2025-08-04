const express = require("express");
const router = express.Router();
const auth = require("../controllers/authentication/authentication_handler");
const JwtService = require("../middleware/jwt");

router.post("/login", auth.loginHandler);
router.post("/register", auth.registerHandler);
router.post("/send-otp", auth.sendOtp);

module.exports = router;
