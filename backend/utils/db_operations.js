const mongoose = require("mongoose");
const DBService = require("../services/mongodb");
const databaseObject = new DBService();

module.exports.convertStringIdToMongooId = (id) => {
    try {
        const mongooseId = new mongoose.Types.ObjectId(id);
        return mongooseId;
    } catch (error) {
        console.error(`[dbUtils-convertStringIdToMongooId] Error converting string ID to Mongoose ObjectId: \n${error}`);
        throw new Error(`Invalid Id - ${id}`);
    }
};

module.exports.getDistinctValues = async (columns, collectionName) => {
    try {
        if (!columns || !columns?.length) {
            return {};
        }

        const groupStage = { _id: "" };

        columns.forEach((column) => {
            groupStage[column] = { $addToSet: `$${column}` };
        });

        const pipeline = [{ $group: groupStage }, { $project: { _id: 0 } }];

        console.log(`[getDistinctColumnsPipeline] Generated pipeline for distinct columns - ${JSON.stringify(pipeline)}`);

        const distinctValues = await this.aggregate(pipeline, collectionName);

        return distinctValues?.length ? distinctValues[0] : {};
    } catch (error) {
        console.error(`[dbUtils-getDistinctValues] Error while getting distinct values: \n${error}`);
        return {};
    }
};

module.exports.findOne = async (findQuerry, collectionName, projection = undefined, errorMessage = undefined) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(`[dbUtils-findOne] Executing findQuerry over ${collectionName} - \n${JSON.stringify(findQuerry)}`);

        let result = undefined;

        if (projection) {
            result = await collectionModel.findOne(findQuerry, projection);
        } else {
            result = await collectionModel.findOne(findQuerry);
        }

        // console.log(`[dbUtils-findOne] findQuerry result is - \n${JSON.stringify(result)}`);

        if (result) {
            return result;
        } else {
            if (errorMessage) {
                throw new Error(errorMessage);
            }
        }

        return result;
    } catch (error) {
        console.log(`[dbUtils-findOne] Error finding doc with findQuerry - \n${error}`);
        throw error;
    }
};

module.exports.create = async (newObj, collectionName) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(`[dbUtils-create] Executing create over ${collectionName} - \n${JSON.stringify(newObj)}`);

        const result = await collectionModel.create(newObj);

        console.log(`[dbUtils-create] create result over ${collectionName} - \n${JSON.stringify(result)}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-create]  Error creating doc with error - \n${error}`);
        throw error;
    }
};

module.exports.aggregate = async (pipeline, collectionName) => {
    try {
        await databaseObject.connect();
        const collectionModel = await databaseObject.getModel(collectionName);

        // console.log(`Executing aggregate pipeline on ${collectionName} and \n${JSON.stringify(pipeline)}`);

        const result = await collectionModel.aggregate(pipeline);

        // console.log(`Aggregate result - \n${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        console.log(`Error aggregating document: ${error}`);
        throw error;
    }
};

module.exports.updateOne = async (filter, update, collectionName, upsert = false) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(
            `[dbUtils-updateOne] Executing updateOne over ${collectionName} - \nFilter: ${JSON.stringify(
                filter
            )} - Update: ${JSON.stringify(update)}`
        );

        // Add the default option upsert: false to the updateOne method
        const result = await collectionModel.updateOne(filter, update, { upsert });

        console.log(`[dbUtils-updateOne] updateOne result over ${collectionName} - \n${JSON.stringify(result)}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-updateOne] Error updating document: ${error}`);
        throw error;
    }
};

module.exports.deleteOne = async (filter, collectionName) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(`[dbUtils-deleteOne] Executing deleteOne over ${collectionName} - \nFilter: ${JSON.stringify(filter)}`);

        const result = await collectionModel.deleteOne(filter);

        console.log(`[dbUtils-deleteOne] deleteOne result over ${collectionName} - \n${JSON.stringify(result)}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-deleteOne] Error deleting document: ${error}`);
        throw error;
    }
};

module.exports.deleteMany = async (filter, collectionName) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(`[dbUtils-deleteMany] Executing deleteMany over ${collectionName} - \nFilter: ${JSON.stringify(filter)}`);

        const result = await collectionModel.deleteMany(filter);

        console.log(`[dbUtils-deleteMany] deleteMany result over ${collectionName} - \n${JSON.stringify(result)}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-deleteMany] Error deleting many document: ${error}`);
        throw error;
    }
};

module.exports.findMany = async (filter, collectionName, projection = undefined) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(`[dbUtils-findMany] Executing findMany over ${collectionName} - Filter: ${JSON.stringify(filter)}`);

        let result = undefined;

        if (projection) {
            result = await collectionModel.find(filter, projection);
        } else {
            result = await collectionModel.find(filter);
        }

        // console.log(`[dbUtils-findMany] findMany result over ${collectionName} - \n${JSON.stringify(result)}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-findMany] Error finding documents: ${error}`);
        throw error;
    }
};

module.exports.updateMany = async (filter, update, collectionName) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(
            `[dbUtils-updateMany] Executing updateMany over ${collectionName} - \nFilter: ${JSON.stringify(
                filter
            )} - Update: ${JSON.stringify(update)}`
        );

        const result = await collectionModel.updateMany(filter, update);

        console.log(`[dbUtils-updateMany] updateMany result over ${collectionName} - \n${JSON.stringify(result)}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-updateMany] Error updating documents: ${error}`);
        throw error;
    }
};

module.exports.createIndex = async (fields, collectionName) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);

        // Create the index
        const result = await collectionModel.createIndexes(fields);

        console.log(`Index created successfully on collection '${collectionName}' with fields:`, fields);
        console.log("Index creation result:", result);

        // Return the result of index creation
        return result;
    } catch (error) {
        console.error("Error creating index:", error);
        throw error;
    }
};

module.exports.bulkWrite = async (bulkOperations, collectionName) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(`[dbUtils-bulkWrite] Executing bulkWrite over ${collectionName}`);

        // Execute bulkWrite operation
        const result = await collectionModel.bulkWrite(bulkOperations);

        console.log(`[dbUtils-bulkWrite] bulkWrite result over ${collectionName} - \n${JSON.stringify(result)}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-bulkWrite] Error executing bulkWrite operation: ${error}`);
        throw error;
    }
};

module.exports.count = async (filterQuery, collectionName) => {
    try {
        const collectionModel = await databaseObject.getModel(collectionName);
        console.log(`[dbUtils-count] Executing count over ${collectionName} - \nFilter: ${JSON.stringify(filterQuery)}`);

        const result = await collectionModel.countDocuments(filterQuery);

        console.log(`[dbUtils-count] count result over ${collectionName} - \n${result}`);

        return result;
    } catch (error) {
        console.log(`[dbUtils-count] Error counting documents: ${error}`);
        throw error;
    }
};
