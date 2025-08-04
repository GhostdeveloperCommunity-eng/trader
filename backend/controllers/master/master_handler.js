const commonUtils = require("../../utils/common");
const dbUtils = require("../../utils/db_operations");
const configs = require("../../configs.json");
const DATABASE_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS;
const PLURAL_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS_PLURAL;
const ROLES = configs.CONSTANTS.ROLES;

module.exports.createMasterHandler = async (req, res) => {
    try {
        const role = req.decodedToken.role || [];

        const requiredFields = [
            { property: "name", optional: false },
            { property: "media", optional: true },
            { property: "brandId", optional: false },
            { property: "categoryId", optional: false },
            { property: "description", optional: true },
            { property: "skuCode", optional: false },
            { property: "mrp", optional: false },
            { property: "size", optional: false },
        ];

        let payload = await commonUtils.validateRequestBody(req.body, requiredFields);

        // if seller is creating master, then isActive will be false
        if (role.includes(ROLES.SELLER)) {
            payload.isActive = false;
        }

        // create master
        let master = await dbUtils.create(payload, DATABASE_COLLECTIONS.MASTER);

        return res.status(200).json({ type: "success", message: "Master created successfully", data: master });
    } catch (error) {
        console.log(`[createMasterHandler] error: ${error}`);
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.updateMasterHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "id", optional: false },
            { property: "name", optional: true },
            { property: "media", optional: true },
            { property: "brandId", optional: true },
            { property: "categoryId", optional: true },
            { property: "description", optional: true },
            { property: "skuCode", optional: true },
            { property: "mrp", optional: true },
            { property: "size", optional: true },
        ];

        let { id, ...payload } = await commonUtils.validateRequestBody(req.body, requiredFields);

        const masterId = await dbUtils.convertStringIdToMongooId(id);
        const master = await dbUtils.findOne(masterId, DATABASE_COLLECTIONS.MASTER);

        // if master not found
        if (commonUtils.validateAndRespond(!master, "Master not found", 404, res)) return;

        await dbUtils.updateOne({ _id: masterId }, payload, DATABASE_COLLECTIONS.MASTER);

        return res.status(200).json({ type: "success", message: "Master updated successfully" });
    } catch (error) {
        console.log(`[updateMasterHandler] error: ${error}`);
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.getAllMasterHandler = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const search = req.query.search ? req.query.search : "";
        const sort = req.query.sort ? req.query.sort : "createdAt_EP";
        const sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : -1;

        const filterQuery = {};
        const sortQuery = { [sort]: sortOrder };

        // filter by search
        if (search) {
            filterQuery.$or = [
                { name: { $regex: search, $options: "i" } },
                { skuCode: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const pipeline = [
            { $match: filterQuery },
            { $addFields: { brandId: { $toObjectId: "$brandId" } } },
            { $addFields: { categoryId: { $toObjectId: "$categoryId" } } },
            {
                $lookup: {
                    from: PLURAL_COLLECTIONS.BRAND,
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brandDetails",
                },
            },
            { $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: PLURAL_COLLECTIONS.CATEGORY,
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
            { $sort: sortQuery },
            ...commonUtils.generatePaginationPipelineStage(page, limit, "data"),
        ];

        console.log("[getAllMasterHandler] pipeline : ", JSON.stringify(pipeline, null, 2));

        const result = await dbUtils.aggregate(pipeline, DATABASE_COLLECTIONS.MASTER);
        if (!result?.[0]?.data?.length) {
            return res.status(200).json({ type: "success", message: "No masters found", data: [] });
        }

        return res.status(200).json({
            type: "success",
            message: "Master fetched successfully",
            ...result?.[0],
        });
    } catch (error) {
        console.log(`[getMasterHandler] error: ${error}`);
        return res.status(500).json({ type: "error", message: error.message });
    }
};
