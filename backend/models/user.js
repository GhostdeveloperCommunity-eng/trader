const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const configs = require("../configs.json");
const CONFIG = configs.CONSTANTS;

const ROLE = configs.CONSTANTS.ROLES;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    role: {
        type: [String],
        enum: Object.values(ROLE),
        required: true,
    },
    status: {
        type: String,
        enum: [CONFIG.STATUS.ACTIVE, CONFIG.STATUS.INACTIVE],
        default: CONFIG.STATUS.ACTIVE,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
    },
    profileImg: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdAt_EP: {
        type: Number,
        default: Date.now() / 1000,
        index: true,
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
        index: true,
        required: true,
    },
});

const users = mongoose.model(CONFIG.DATABASE_COLLECTIONS.USER, userSchema);
module.exports = users;
