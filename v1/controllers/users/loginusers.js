import { Router } from "express";
import {
  signupSendOtp,
  loginOtp,
  verifySignupOtp,
  verifyLoginOtp,
} from "./functions.js";
import { hofSchemaValidation } from "../../utils/functions.js";
import {
  signupSendOtpSchema,
  loginSendOtpSchema,
  verifySignupOtpSchema,
  loginVerifyOtpSchema,
} from "../../utils/schema.js";
const router = new Router();

router.post(
  "/signup_send_otp",
  hofSchemaValidation(signupSendOtpSchema),
  signupSendOtp
);
router.post(
  "/signup_verify_otp",
  hofSchemaValidation(verifySignupOtpSchema),
  verifySignupOtp
);
router.post(
  "/login_send_otp",
  hofSchemaValidation(loginSendOtpSchema),
  loginOtp
);
router.post(
  "/login_verify_otp",
  hofSchemaValidation(loginVerifyOtpSchema),
  verifyLoginOtp
);

export default router;
