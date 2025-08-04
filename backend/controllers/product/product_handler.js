const commonUtils = require("../../utils/common");
const dbUtils = require("../../utils/db_operations");
const configs = require("../../configs.json");
const DATABASE_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS;
const PLURAL_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS_PLURAL;

module.exports.createProductHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "name", optional: false },
            { property: "media", optional: true },
            { property: "lot", optional: false },
            { property: "masterId", optional: false },
            { property: "brandId", optional: false },
            { property: "categoryId", optional: false },
            { property: "tags", optional: true },
        ];

        let payload = await commonUtils.validateRequestBody(req.body, requiredFields);

        const minPrice = payload.lot.reduce((min, lot) => Math.min(min, lot.price), Infinity);
        const maxPrice = payload.lot.reduce((max, lot) => Math.max(max, lot.price), 0);

        payload.minPrice = minPrice;
        payload.maxPrice = maxPrice;

        let product = await dbUtils.create(payload, DATABASE_COLLECTIONS.PRODUCT);

        return res.status(200).json({
            type: "success",
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.log("[createProductHandler] error: ", error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
};

module.exports.updateProductHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "id", optional: false },
            { property: "name", optional: true },
            { property: "media", optional: true },
            { property: "lot", optional: true },
            { property: "masterId", optional: true },
            { property: "brandId", optional: true },
            { property: "categoryId", optional: true },
            { property: "tags", optional: true },
        ];

        let { id, ...payload } = await commonUtils.validateRequestBody(req.body, requiredFields);
        const productId = await dbUtils.convertStringIdToMongooId(id);
        const product = await dbUtils.findOne({ _id: productId }, DATABASE_COLLECTIONS.PRODUCT);
        if (commonUtils.validateAndRespond(!product, "Product not found", 404, res)) return;

        await dbUtils.updateOne({ _id: productId }, payload, DATABASE_COLLECTIONS.PRODUCT);

        return res.status(200).json({ type: "success", message: "Product updated successfully", data: product });
    } catch (error) {
        console.log("[updateProductHandler] error: ", error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
};

module.exports.getProductHandler = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const search = req.query.search ? req.query.search : "";
        const sort = req.query.sort ? req.query.sort : "minPrice";
        const sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : 1;
        const brandId = req.query.brandId ? req.query.brandId : "";
        const categoryId = req.query.categoryId ? req.query.categoryId : "";
        const masterId = req.query.masterId ? req.query.masterId : "";

        const filterQuery = {};
        const sortQuery = { [sort]: sortOrder };

        if (search) {
            filterQuery.$or = [{ name: { $regex: search, $options: "i" } }];
        }

        // filter by brandId, categoryId, masterId if present
        if (brandId) filterQuery.brandId = brandId;
        if (categoryId) filterQuery.categoryId = categoryId;
        if (masterId) filterQuery.masterId = masterId;

        const pipeline = [
            { $match: filterQuery },
            { $addFields: { brandId: { $toObjectId: "$brandId" } } },
            { $addFields: { categoryId: { $toObjectId: "$categoryId" } } },
            { $addFields: { masterId: { $toObjectId: "$masterId" } } },
            {
                $lookup: {
                    from: PLURAL_COLLECTIONS.MASTER,
                    localField: "masterId",
                    foreignField: "_id",
                    as: "masterDetails",
                },
            },
            {
                $lookup: {
                    from: PLURAL_COLLECTIONS.BRAND,
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brandDetails",
                },
            },
            {
                $lookup: {
                    from: PLURAL_COLLECTIONS.CATEGORY,
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            { $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$masterDetails", preserveNullAndEmptyArrays: true } },
            { $sort: sortQuery },
            ...commonUtils.generatePaginationPipelineStage(page, limit, "data"),
        ];

        console.log("[getProductHandler] pipeline -->", JSON.stringify(pipeline, null, 2));
        const result = await dbUtils.aggregate(pipeline, DATABASE_COLLECTIONS.PRODUCT);
        if (!result?.[0]?.data?.length) {
            return res.status(200).json({ type: "success", message: "No products found", data: [] });
        }

        return res.status(200).json({
            type: "success",
            message: "products fetched successfully",
            ...result?.[0],
        });
    } catch (error) {
        console.log("[getProductHandler] error: ", error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
};
