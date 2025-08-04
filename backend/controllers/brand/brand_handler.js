const commonUtils = require("../../utils/common");
const dbUtils = require("../../utils/db_operations");
const configs = require("../../configs.json");
const DATABASE_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS;

module.exports.createBrandHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "name", optional: false },
            { property: "description", optional: true },
        ];
        let { name, description } = await commonUtils.validateRequestBody(req.body, requiredFields);
        let brand = await dbUtils.create({ name, description }, DATABASE_COLLECTIONS.BRAND);
        return res.status(200).json({ type: "success", message: "Brand created successfully", data: brand });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.updateBrandHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "id", optional: false },
            { property: "name", optional: true },
            { property: "description", optional: true },
        ];

        let payload = await commonUtils.validateRequestBody(req.body, requiredFields);
        const brandId = await dbUtils.convertStringIdToMongooId(payload.id);

        // update brand details
        let brand = await dbUtils.updateOne({ _id: brandId }, payload, DATABASE_COLLECTIONS.BRAND);
        return res.status(200).json({ type: "success", message: "Brand updated successfully", data: brand });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.getAllBrandsHandler = async (req, res) => {
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
            filterQuery.$or = [{ name: { $regex: search, $options: "i" } }];
        }

        const pipeline = [
            { $match: filterQuery },
            { $sort: sortQuery },
            ...commonUtils.generatePaginationPipelineStage(page, limit, "data"),
        ];

        console.log("[getAllBrandsHandler] pipeline : ", JSON.stringify(pipeline, null, 2));

        let brands = await dbUtils.aggregate(pipeline, DATABASE_COLLECTIONS.BRAND);

        if (!brands?.[0]?.data?.length) {
            return res.status(200).json({ type: "success", message: "No brands found", data: [] });
        }
        return res.status(200).json({
            type: "success",
            message: "Brands fetched successfully",
            ...brands?.[0],
        });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.getBrandNamesHandler = async (req, res) => {
    try {
        const search = req.query.search ? req.query.search : "";

        const filterQuery = {};
        if (search) {
            filterQuery.$or = [{ name: { $regex: search, $options: "i" } }];
        }

        const pipeline = [{ $match: filterQuery }, { $project: { _id: 1, name: 1 } }];
        let brands = await dbUtils.aggregate(pipeline, DATABASE_COLLECTIONS.BRAND);

        return res.status(200).json({ type: "success", message: "Brands fetched successfully", data: brands });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};
