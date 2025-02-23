import CommonModel from "../../model/commonmodel.js";
import { v4 as uuidV4 } from "uuid";
export const createSellerProduct = async (req, res, next) => {
  try {
    // 1.) first check if authorized user seller or not
    if (!req._user.roles.includes("seller")) {
      throw {
        message: "this user is not seller first register with us as seller to",
      };
    }
    const { masterProductId, deliveryPins, lots } = req.body;

    // 2.) validate seller product if it is available or not with same master_product
    const response = await CommonModel.find({
      $where: { pk: "SELLER_PRODUCT", sk: masterProductId, sk1: req._user._id },
    });
    if (response && response.length !== 0) {
      res.send({
        code: 1,
        data: null,
        message: "This is product already exist with us",
      });
      return;
    }
    const varientIds = [];
    for (const lot of lots) {
      if (new Date(lot.expiry) <= new Date(lot.mfg)) {
        throw {
          message: `one of your varient is expire with this varientId ${varientIds}`,
        };
      }
      lot.id = uuidV4();
      varientIds.push(lot.varientId);
    }
    const product = {
      pk: "SELLER_PRODUCT",
      sk: masterProductId,
      sk1: req._user._id,
      sk2: deliveryPins,
      lots,
    };
    const sellerProduct = await CommonModel.create(product);
    const masterProduct = await CommonModel.findOne(
      { _id: masterProductId },
      {
        "product_detail.varients": {
          $elemMatch: { id: { $in: varientIds } },
        },
      }
    );

    return res.send({
      code: 1,
      data: {
        sellerProduct,
        masterProduct,
      },
    });
  } catch (error) {
    res.send({ code: 0, message: error.message || "SOMETHING WENT WRONG" });
  }
};

const obj = {
  masterProductId: "obj ID",
  deliveryPins: [],
  lots: [
    {
      id: "",
      varientId: "ajhgf",
      quantity: "",
      mfg: "",
      expiry: "",
      price: "",
      discount: "",
      size: "30",
    },
  ],
};

export const getAllSellerProduct = (req, res, next) => {};
