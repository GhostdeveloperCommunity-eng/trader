import CategoryModel from "../../model/categoryModel.js";
import CommonModel from "../../model/commonmodel.js";
import { v4 as uuidV4 } from "uuid";
import MasterProductModel from "../../model/MasterModel.js";
export const createMasterProduct = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    const category = await CategoryModel.findById(categoryId);

    console.log(category)

    if (!category) {
      throw {
        status: 400,
        message: "Invalid Category",
      };
    }
    const { brand, name, skuCode, subCategory, productSubCategory, size, mrp , images} =
      req.body;
   
    const response = await MasterProductModel.create({
      name,
      brand,
      skuCode,
      active: true,
      subCategory,
      productSubCategory,
      size,
      mrp,
      images,
    });
    const data = {
      ...response,
      masterProductId: response._id,
      categoryId,
    };
    res.status(200).json({
      code: 1,
      data,
      message: "master product created successfully",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      data: null,
      message: error.message || "SOMETHING WENT WRONG",
    });
  }
};

export const getAllMasterProduct = async (req, res, next) => {
  try {
    const response = await MasterProductModel.find();
    res.status(200).json({
      code: 1,
      data: response,
      message: "get all masterproduct successfully",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      data: [],
      message: error.message || "SOMETHING WENT WRONG",
    });
  }
};
