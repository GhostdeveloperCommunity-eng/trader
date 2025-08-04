const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const configs = require("../configs.json");
const CONFIG = configs.CONSTANTS;

const masterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    media: {
        type: [String],
        default: [],
    },
    brandId: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    skuCode: {
        type: String,
        required: true,
        unique: true,
    },
    mrp: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
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

const master = mongoose.model(CONFIG.DATABASE_COLLECTIONS.MASTER, masterSchema);
module.exports = master;
