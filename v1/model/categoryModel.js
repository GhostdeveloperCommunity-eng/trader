import mongoose from "mongoose";
import { commonSchema } from "./commonmodel.js";
import { Category } from "../constants/tables.js";

const CategoryModel = mongoose.model(Category, commonSchema);
export default CategoryModel;
