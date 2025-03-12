import CommonModel from "../../model/commonmodel.js";
import { v4 as uuidV4 } from "uuid";
import { ObjectId } from "mongodb";

function populateLots(sellerProduct, masterProduct) {
  // Create a Map of varients using their 'id' as the key
  const varientMap = new Map();
  for (const varient of masterProduct.product_detail.varients) {
    varientMap.set(varient.id, varient);
  }

  // Populate lots array
  const populatedLots = sellerProduct.lots.map((lot) => {
    const varientDetails = varientMap.get(lot.varientId);
    if (!varientDetails) return lot; // If varientId not found, return lot as is

    // Find the correct MRP based on the size of the seller product
    const sizeMrpEntry =
      varientDetails.sizeMrp.find((s) => s.size === lot.size) || {};
    const mrp = sizeMrpEntry.mrp || null; // Default to null if not found

    return {
      ...lot,
      productName: masterProduct.product_detail.name,
      varientName: varientDetails.name,
      images: varientDetails.images,
      slug: varientDetails.slug,
      mrp, // Only include relevant size and mrp
    };
  });

  // Return the final object
  return {
    _id: sellerProduct._id,
    masterProductId: sellerProduct.sk,
    deliveryPins: sellerProduct.sk2,
    sellerId: sellerProduct.sk1,
    Lots: populatedLots,
  };
}

// Example usage

export const createSellerProduct = async (req, res, next) => {
  try {
    // 1.) first check if authorized user seller or not

    if (!req._user.roles.includes("seller")) {
      throw {
        message: "this user is not seller first register with us as seller to",
      };
    }
    const { masterProductId, lots } = req.body;

    // 2.) validate seller product if it is available or not with same master_product
    const response = await CommonModel.find({
      pk: "SELLER_PRODUCT",
      sk: masterProductId,
      sk1: req._user._id,
    });

    if (response && response.length !== 0) {
      const masterProduct = await CommonModel.findById(masterProductId);
      res.send({
        code: 1,
        data: { sellerProduct: response, masterProduct },
        message: "This is product already exist with you",
      });
      return;
    }
    const varientIds = [];
    for (const lot of lots) {
      if (new Date(lot.expiry) <= new Date(lot.mfg)) {
        throw {
          message: `one of your varient is expire with this varientId ${lot.varientId}`,
        };
      }
      lot.id = uuidV4();
      varientIds.push(lot.varientId);
    }

    const masterProduct = await CommonModel.aggregate([
      {
        $match: { _id: new ObjectId(masterProductId) },
      },
      {
        $project: {
          product_detail: {
            name: "$product_detail.name",
            brand: "$product_detail.brand",
            varients: {
              $filter: {
                input: "$product_detail.varients",
                as: "varients",
                cond: { $in: ["$$varients.id", varientIds] },
              },
            },
          },
        },
      },
    ]);
    // return res.send(masterProduct);
    // {
    //     $project: {
    //       product_detail: {
    //         varients: {
    //           $filter: {
    //             input: "$product_detail.varients",
    //             as: "varients",
    //             cond: { $in: ["$$varients.id", varientIds] },
    //           },
    //         },
    //       },
    //     },
    //   },
    const masterProductDetail = masterProduct[0];

    if (
      masterProductDetail.product_detail.varients.length == 0 ||
      varientIds.length !== masterProductDetail.product_detail.varients.length
    ) {
      throw {
        message: "wrong varients ids",
      };
    }

    if (masterProductDetail.product_detail.varients == 0) {
      throw {
        message: "wrong varients ids",
      };
    }
    const product = {
      pk: "SELLER_PRODUCT",
      sk: masterProductId,
      sk1: req._user._id,
      sk2: ["*"],
      lots,
    };
    const sellerProduct = await CommonModel.create(product);
    const data = populateLots(sellerProduct, masterProductDetail);

    return res.send({
      code: 1,
      data,
    });
  } catch (error) {
    res.send({ code: 0, message: error.message || "SOMETHING WENT WRONG" });
  }
};

// const obj = {
//   masterProductId: "obj ID",
//   deliveryPins: [],
//   lots: [
//     {
//       id: "",
//       varientId: "ajhgf",
//       quantity: "",
//       mfg: "",
//       expiry: "",
//       price: "",
//       discount: "",
//       size: "30",
//     },
//   ],
// };

export const getAllSellerProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    // Step 1: Fetch seller products
    const sellerProducts = await CommonModel.find({ pk: "SELLER_PRODUCT" })
      .skip(skipNum)
      .limit(limitNum)
      .lean(); // Use .lean() for better performance

    if (sellerProducts.length === 0) {
      return res.json({
        page: pageNum,
        limit: limitNum,
        totalCount: 0,
        totalPages: 0,
        data: [],
      });
    }

    // Step 2: Extract master product IDs as ObjectId
    const masterProductIds = sellerProducts.map((p) => new ObjectId(p.sk));

    // Step 3: Fetch master products in one query and store them in a map
    const masterProducts = await CommonModel.find({
      _id: { $in: masterProductIds },
      pk: "MASTER#PRODUCT",
    }).lean();

    const masterProductMap = new Map(
      masterProducts.map((mp) => [mp._id.toString(), mp])
    );

    // Step 4: Populate lots using your function
    const enrichedProducts = sellerProducts.map((sellerProduct) => {
      const masterProduct = masterProductMap.get(sellerProduct.sk);
      return populateLots(sellerProduct, masterProduct);
    });

    // Step 5: Get total count
    const totalCount = await CommonModel.countDocuments({
      pk: "SELLER_PRODUCT",
    });
    const totalPages = Math.ceil(totalCount / limitNum);

    // Step 6: Return response
    res.json({
      page: pageNum,
      limit: limitNum,
      totalCount,
      totalPages,
      data: enrichedProducts,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
