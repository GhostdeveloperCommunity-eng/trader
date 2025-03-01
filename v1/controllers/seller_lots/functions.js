import CommonModel from "../../model/commonmodel";
import { v4 as uuidV4 } from "uuid";
export const createLot = async (req, res) => {
  try {
    const { sellerId, sellerProductId, masterProductId, varientId, lotId } =
      req.body;
    if (sellerId === req._user._id) {
      res.send({
        code: 1,
        data: null,
        message: "This is your lot",
      });
    }
    // 1.) verify the lot
    const sellerProduct = await CommonModel.findOne(
      { _id: sellerProductId, "lots.id": lotId },
      { projection: { "lots.$": 1 } }
    );

    if (
      !sellerProduct ||
      !sellerProduct.lots ||
      sellerProduct.lots.length === 0
    ) {
      throw {
        message: "lot not found",
      };
    }
    const { _id, ...lotToCompare } = sellerProduct;
    // 2.) check if this product is available with login seller or not
    const availableProduct = await CommonModel.aggregate([
      {
        $match: {
          pk: "SELLER_PRODUCT",
          sk: masterProductId,
          sk1: req._user._id,
        },
      },
      {
        $project: {
          sellerProductId: "$_id",
          masterProductId: "$sk",
          sellerId: "$sk1",
          lots: {
            $filter: {
              input: "$lots",
              as: "lot",
              cond: {
                $and: Object.entries(lotToCompare).map(([key, value]) => ({
                  $eq: ["$$lot." + key, value],
                })),
              },
            },
          },
        },
      },
    ]);

    const varient = await CommonModel.aggregate([
      {
        $match: { _id: masterProductId },
      },
      {
        $addFields: {
          varients: {
            $filter: {
              input: "$product_detail.varients",
              as: "variant",
              cond: { $eq: ["$$variant.id", varientId] },
            },
          },
        },
      },
      {
        $project: {
          masterProductId: "$_id",

          categoryId: "$sk",
          varientNames: "$sk1",
          varientSize: "$sk2",
          brandName: "$sk3",
          product_name: "$sk4",
          varients: 1,
        },
      },
    ]);

    let lotAvailable = false;
    if (availableProduct && availableProduct.length > 0) {
      if (availableProduct[0].lots.length == 0) {
        // 1.) insert new lot object
        const _id = availableProduct[0].sellerProductId;
        let lot = { ...lotToCompare, id: uuidV4() };
        const response = await CommonModel.findByIdAndUpdate(
          _id,
          { $push: { lots: lot } },
          { new: true }
        );
        // need to get varient and its detail
        if (response) {
          const sellerProduct = {
            sellerProductId: response._id,
            masterProductId: response.sk,
            sellerId: response.sk1,
            lots: response.lots,
          };

          const data = {
            sellerProduct,
            masterProduct: varient,
          };

          return res.send({
            code: 1,
            data,
            message: "lot is added to ",
          });
        }
      } else {
        // 2.)
        return res.send({
          code: 1,
          data: {
            sellerProduct: availableProduct,
            masterProduct: varient,
          },
          message: "you have already this lot",
        });
      }
    } else {
      const newLot = { ...lotToCompare, id: uuidV4() };
      const createSellerProduct = await CommonModel.create({
        pk: "SELLER_PRODUCT",
        sk: masterProductId,
        sk1: req._user._id,
        lots: [newLot],
      });
      const sellerProduct = {
        sellerProductId: createSellerProduct._id,
        masterProductId,
        sellerId: req._user._id,
        lots: [newLot],
      };
      const data = {
        sellerProduct,
        masterProduct: varient,
      };

      return res.send({
        code: 1,
        data,
        message: "",
      });
    }
  } catch (error) {
    res.send({
      code: 0,
      message: error.message || "SOMETHING WET WRONG",
      data: null,
    });
  }
};
