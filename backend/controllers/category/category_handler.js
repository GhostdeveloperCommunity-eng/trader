const commonUtils = require("../../utils/common");
const dbUtils = require("../../utils/db_operations");
const configs = require("../../configs.json");
const DATABASE_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS;

module.exports.createCategoryHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "name", optional: false },
            { property: "description", optional: true },
        ];
        let { name, description } = await commonUtils.validateRequestBody(req.body, requiredFields);
        let category = await dbUtils.create({ name, description }, DATABASE_COLLECTIONS.CATEGORY);
        return res.status(200).json({ type: "success", message: "Category created successfully", data: category });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.updateCategoryHandler = async (req, res) => {
    try {
        const requiredFields = [
            { property: "id", optional: false },
            { property: "name", optional: true },
            { property: "description", optional: true },
        ];

        let payload = await commonUtils.validateRequestBody(req.body, requiredFields);
        const categoryId = await dbUtils.convertStringIdToMongooId(payload.id);

        // update category details
        let category = await dbUtils.updateOne({ _id: categoryId }, payload, DATABASE_COLLECTIONS.CATEGORY);

        return res.status(200).json({
            type: "success",
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.getAllCategoriesHandler = async (req, res) => {
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

        console.log("[getAllCategoriesHandler] pipeline : ", JSON.stringify(pipeline, null, 2));

        let categories = await dbUtils.aggregate(pipeline, DATABASE_COLLECTIONS.CATEGORY);

        if (!categories?.[0]?.data?.length) {
            return res.status(200).json({ type: "success", message: "No categories found", data: [] });
        }
        return res.status(200).json({
            type: "success",
            message: "Categories fetched successfully",
            ...categories?.[0],
        });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};

module.exports.getCategoryNamesHandler = async (req, res) => {
    try {
        const search = req.query.search ? req.query.search : "";

        const filterQuery = {};
        if (search) {
            filterQuery.$or = [{ name: { $regex: search, $options: "i" } }];
        }

        const pipeline = [{ $match: filterQuery }, { $project: { _id: 1, name: 1 } }];
        let categories = await dbUtils.aggregate(pipeline, DATABASE_COLLECTIONS.CATEGORY);

        return res.status(200).json({ type: "success", message: "Categories fetched successfully", data: categories });
    } catch (error) {
        return res.status(500).json({ type: "error", message: error.message });
    }
};
