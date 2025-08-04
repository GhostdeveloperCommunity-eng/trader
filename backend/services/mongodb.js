const mongoose = require("mongoose");
const user = require("../models/user");
const otp = require("../models/otp");
const brand = require("../models/brand");
const category = require("../models/category");
const master = require("../models/master");
const product = require("../models/product");

class DBService {
    constructor() {
        console.log(`Initializing database connection.`);
        this.connect();
    }

    setValidators() {
        return { runValidators: true };
    }

    async connect() {
        try {
            await mongoose
                .plugin((schema) => {
                    schema.pre("findOneAndUpdate", this.setValidators);
                    schema.pre("updateMany", this.setValidators);
                    schema.pre("updateOne", this.setValidators);
                    schema.pre("update", this.setValidators);
                })
                .connect(process.env.MONGO_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error(`MongoDB connection error: ${error}`);
            process.exit(1);
        }
    }

    async close() {
        await mongoose.connection.close();
        console.log(`Disconnected from MongoDB`);
    }

    getModel(modelName) {
        return mongoose.model(modelName);
    }
}

module.exports = DBService;
