const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const configs = require("../configs.json");
const CONFIG = configs.CONSTANTS;

const lotSchema = new Schema({
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    originalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
});

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    media: {
        type: [String],
        default: [],
    },
    lot: {
        type: [lotSchema],
        default: [],
    },
    status: {
        type: String,
        default: CONFIG.STATUS.ACTIVE,
        index: true,
        enum: [CONFIG.STATUS.ACTIVE, CONFIG.STATUS.INACTIVE],
    },
    tags: {
        type: [String],
        default: [],
    },
    minPrice: {
        type: Number,
        default: 0,
        index: true,
    },
    maxPrice: {
        type: Number,
        default: 0,
    },
    sellerId: {
        type: String,
    },
    masterId: {
        type: String,
    },
    brandId: {
        type: String,
    },
    categoryId: {
        type: String,
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

const product = mongoose.model(CONFIG.DATABASE_COLLECTIONS.PRODUCT, productSchema);
module.exports = product;
