import Joi from "joi";
export const lotSchema = Joi.object({
  sellerId: Joi.string().required(),
  sellerProductId: Joi.string().required(),
  masterProductId: Joi.string().required(),
  varientId: Joi.string().required(),
  lotId: Joi.string().required(),
});
