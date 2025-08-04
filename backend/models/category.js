const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const configs = require("../configs.json");
const CONFIG = configs.CONSTANTS;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "",
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

const categories = mongoose.model(CONFIG.DATABASE_COLLECTIONS.CATEGORY, categorySchema);
module.exports = categories;
