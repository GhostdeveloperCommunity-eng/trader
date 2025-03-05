import CommonModel from "../../model/commonmodel.js";
import { v4 as uuidV4 } from "uuid";
export const createMasterProduct = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    const category = await CommonModel.findById(categoryId);
    if (!category) {
      throw {
        status: 400,
        message: "Invalid Category",
      };
    }
    const { pk } = category;
    if (pk !== "CATEGORY#GENERAL") {
      throw {
        status: 400,
        message: "Invalid Category",
      };
    }
    const { brandName, name, varients } = req.body;
    let varientNames = [];
    let varientSizes = [];
    for (let obj of varients) {
      obj.id = uuidV4();
      obj.sizeMrp.forEach((sizeWithPriceObj) =>
        varientSizes.push(sizeWithPriceObj.size)
      );
      varientNames.push(obj.name);
    }
    varientNames = [...new Set(varientNames)];
    varientSizes = [...new Set(varientSizes)];
    const response = await CommonModel.create({
      pk: "MASTER#PRODUCT",
      sk: categoryId,
      sk1: varientNames,
      sk2: varientSizes,
      sk3: brandName,
      sk4: name,
      product_detail: {
        name,
        brand: brandName,
        varients,
      },
      active: true,
    });
    const data = {
      ...response.product_detail,
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
    const response = await CommonModel.find({
      $where: { pk: "MASTER#PRODUCT" },
    });
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
