const mongoose = require("mongoose");
const crypto = require("crypto");
const s3Utils = require("../utils/s3");

module.exports.validateRequestBody = async (body, keys) => {
    try {
        let missingKeys = [];
        let payload = {};

        for (const keyObj of keys) {
            const key = keyObj.property;
            const value = body[key];

            if (!value && !keyObj.optional) {
                missingKeys.push(key);
            } else if (value !== undefined) {
                payload[key] = value;
            }
        }

        if (missingKeys.length > 0) {
            const missingKeyString = missingKeys.join(", ");
            throw new Error(`Please provide the following key(s): ${missingKeyString}`);
        }
        return payload;
    } catch (error) {
        console.log(`Error occurred validating request body - ${JSON.stringify(body)}, keys - ${JSON.stringify(keys)} & error - ${error}`);
        throw error;
    }
};

module.exports.throwCustomError = (errorMessage) => {
    throw new Error(errorMessage);
};

module.exports.validateAndRespond = (value, errorMessage, statusCode = 400, res) => {
    if (value) {
        res.status(statusCode).json({
            type: "Error",
            message: errorMessage,
        });
        return true;
    }
    return false;
};

module.exports.generatePaginationPipelineStage = (page, limit, fieldName) => {
    const skip = (page - 1) * limit;

    const pipelineStage = [
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: limit }],
            },
        },
        {
            $project: {
                [fieldName]: "$data",
                pagination: {
                    totalCount: { $arrayElemAt: ["$metadata.total", 0] },
                    page: { $literal: parseInt(page) },
                    limit: { $literal: limit },
                    totalPages: {
                        $ceil: {
                            $divide: [{ $arrayElemAt: ["$metadata.total", 0] }, limit],
                        },
                    },
                },
            },
        },
    ];

    return pipelineStage;
};
