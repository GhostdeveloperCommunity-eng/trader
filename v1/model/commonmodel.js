import mongoose from "mongoose";

const commonSchema = new mongoose.Schema({},{strict:false});

const CommonModel = mongoose.model("common_data_table",commonSchema);

export default CommonModel