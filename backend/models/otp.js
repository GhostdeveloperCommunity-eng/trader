const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const configs = require("../configs.json");
const CONFIG = configs.CONSTANTS;

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        trim: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    otp: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        index: true,
        enum: Object.values(CONFIG.OTP_TYPE),
        required: true,
    },
    status: {
        type: String,
        enum: [CONFIG.STATUS.ACTIVE, CONFIG.STATUS.INACTIVE],
        default: CONFIG.STATUS.ACTIVE,
        index: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        expires: 300,
    },
    createdAt_EP: {
        type: Number,
        default: Date.now() / 1000,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt_EP: {
        type: Number,
        default: Date.now() / 1000,
        required: true,
    },
});

const otps = mongoose.model(CONFIG.DATABASE_COLLECTIONS.OTP, otpSchema);
module.exports = otps;
