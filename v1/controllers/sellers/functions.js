import { v4 as uuidV4 } from "uuid";
import CommonModel from "../../model/commonmodel.js";
export const createSeller = async (req, res, next) => {
  try {
    if (req._user.roles.includes("seller")) {
      res.send({
        code: 1,
        data: null,
        message: "you are already seller",
      });
    }
    const { aadharNumber, gstNumber, locations } = req.body;

    const pinCodes = [];
    for (const location of locations) {
      pinCodes.push(location.pinCode);
      location.id = uuidV4();
      const { latitude, longitude } = location;
      delete location.latitude;
      delete location.longitude;
      location.coordinates = {
        type: "Point",
        coordinates: [latitude, longitude],
      };
    }
    const seller = {
      pk: "SELLER",
      sk: req._user._id,
      sk4: pinCodes,
      coordinates: locations,
    };
    if (aadharNumber) {
      seller.sk1 = aadharNumber;
      seller.aadharNumber = aadharNumber;
    }
    if (gstNumber) {
      seller.gstNumber = gstNumber;
    }

    const response = await CommonModel.create(seller);
    const updateUserAsSeller = await CommonModel.findByIdAndUpdate(
      req._user.id,
      { $addToSet: { roles: "seller" } },
      { new: true }
    );
    const data = {
      userId: req._user._id,
      pinCodes,
      aadharNumber,
      gstNumber,
      coordinates: locations,
      sellerId: response._id,
    };
    res.send({
      code: 1,
      data,
      message: "seller created successfully",
    });
  } catch (error) {}
};
