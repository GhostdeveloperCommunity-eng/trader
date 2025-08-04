const jwtService = require("../../middleware/jwt");
const dbUtils = require("../../utils/db_operations");
const commonUtils = require("../../utils/common");
const configs = require("../../configs.json");
const { sendOtpEmailTemplate } = require("../../utils/templates");
const { sendMail } = require("../../services/email_service");
const DATABASE_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS;

module.exports.loginHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "email", optional: false },
            { property: "password", optional: false },
        ];
        let { email, password } = await commonUtils.validateRequestBody(req.body, requiredFields);

        // Check if user exists
        const findKey = { email };
        let user = await dbUtils.findOne(findKey, DATABASE_COLLECTIONS.USER);
        if (commonUtils.validateAndRespond(!user, "User not found", 404, res)) return;

        // invalid password
        if (commonUtils.validateAndRespond(user.password !== password, "Invalid password", 401, res)) return;

        // Generate JWT token for the user including additional properties
        const tokenData = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        const token = jwtService.generateToken(tokenData);
        delete user.password;

        // Send success response with token
        return res.status(200).json({
            type: "success",
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        console.error(`[loginHandler] Unexpected error occurred: ${error.message}`);
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.registerHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "email", optional: false },
            { property: "password", optional: false },
            { property: "phoneNumber", optional: true },
            { property: "otp", optional: false },
            { property: "firstName", optional: true },
            { property: "lastName", optional: true },
            { property: "profileImg", optional: true },
        ];

        let data = await commonUtils.validateRequestBody(req.body, requiredFields);

        const email = data?.email;
        const otp = data.otp;

        // Verify OTP first
        try {
            await this.verifyOtpCode(email, otp, configs.CONSTANTS.OTP_TYPE.REGISTER_USER_VERIFICATION);
        } catch (otpError) {
            return res.status(401).json({ type: "error", message: otpError.message });
        }

        // Check if user already exists
        const findKey = { email };
        let existingUser = await dbUtils.findOne(findKey, DATABASE_COLLECTIONS.USER);

        if (commonUtils.validateAndRespond(existingUser, "User with this email already exists. Please login instead.", 409, res)) return;

        // Create new user object with validated profile data
        const newUserObj = {
            email: email,
            status: configs.CONSTANTS.STATUS.ACTIVE,
            role: configs.CONSTANTS.ROLES.USER,
            ...data,
        };

        // Create the user
        const user = await dbUtils.create(newUserObj, DATABASE_COLLECTIONS.USER);

        // Generate JWT token for the user
        const tokenData = {
            id: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
        };

        const token = jwtService.generateToken(tokenData);

        // Send success response with token
        return res.status(201).json({
            type: "success",
            message: "User registered successfully",
            token,
            user,
        });
    } catch (error) {
        console.error(`[registerHandler] Unexpected error occurred: ${error.message}`);
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.verifyOtpCode = async (email, otp, type) => {
    const savedOtp = await dbUtils.findOne({ email, type }, DATABASE_COLLECTIONS.OTP);

    if (!savedOtp) {
        throw new Error("The OTP has expired. Please request a new code and try again");
    }

    if (Number.parseInt(otp) !== savedOtp.otp) {
        throw new Error("The OTP you entered is incorrect. Please verify the code and try again.");
    }

    return true;
};

module.exports.sendOtp = async (req, res) => {
    try {
        // Step 1: Fetch email from request body and validate required field
        const requiredFields = [
            { property: "email", optional: false },
            { property: "type", optional: false },
        ];
        let { email, type } = await commonUtils.validateRequestBody(req.body, requiredFields);

        const OTP_TYPE_VALUES = Object.values(configs.CONSTANTS.OTP_TYPE);
        if (!OTP_TYPE_VALUES.includes(type)) {
            throw new Error(`Invalid type`);
        }

        const otpLength = configs.OTP_LENGTH;
        const min = Math.pow(10, otpLength - 1);
        const max = Math.pow(10, otpLength) - 1;
        const otpCode = Math.floor(min + Math.random() * (max - min + 1));

        // send otp over mail
        const emailSubject = "OTP for Trade Application";
        const emailHtml = sendOtpEmailTemplate({
            emailSubject: emailSubject,
            name: email,
            otp: otpCode,
        });
        const emailSent = await sendMail(email, emailSubject, "email text", emailHtml);

        if (!emailSent) {
            throw new Error("Failed to send OTP email.");
        }

        const otpData = {
            email: email,
            otp: otpCode,
            type: type,
        };

        await dbUtils.create(otpData, DATABASE_COLLECTIONS.OTP);

        res.status(200).json({
            type: "success",
            message: "OTP sent successfully.",
        });
    } catch (error) {
        console.error(`[sendOtp] Error occurred: ${error}`);
        res.status(500).json({
            type: "error",
            message: error.message || "An unexpected error occurred.",
        });
    }
};

module.exports.verifyOtp = async (req, res) => {
    try {
        const requiredFields = [
            { property: "phoneNumber", optional: false },
            { property: "otp", optional: false },
            { property: "type", optional: false },
        ];
        let data = await commonUtils.validateRequestBody(req.body, requiredFields);

        const phoneNumber = data.phoneNumber;
        const otp = data.otp;
        const type = data.type;

        await this.verifyOtpCode(phoneNumber, otp, type);

        return res.status(200).json({
            type: "success",
            message: "OTP verified successfully.",
        });
    } catch (error) {
        console.error(`[verifyOtp] Error occurred: ${error}`);
        return res.status(500).json({
            type: "error",
            message: error?.message ?? "Internal server error.",
        });
    }
};
