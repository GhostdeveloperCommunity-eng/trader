import mongoose from "mongoose";
import { commonSchema } from "./commonmodel.js";
import { Master_Product, } from "../constants/tables.js";

const MasterProductModel = mongoose.model(Master_Product, commonSchema);
export default MasterProductModel;
