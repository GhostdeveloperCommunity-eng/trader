const express = require("express");
const router = express.Router();
const s3BucketHandler = require("../controllers/feature/s3_bucket_handler");
const JwtService = require("../middleware/jwt");
const configs = require("../configs.json");
const ROLES = configs.CONSTANTS.ROLES;
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-image", upload.array("image"), s3BucketHandler.uploadImage);

module.exports = router;
