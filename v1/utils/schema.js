import Joi from "joi";

export const categoryObjectSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z]+( [a-zA-Z]+)?$/, "valid name")
    .required()
    .messages({
      "any.required": "The name of the category is required.",
      "string.pattern.base":
        "The name can only contain alphabets and a single space between words.",
      "string.base": "The name must be a string.",
    })
    .label("name"),
  description: Joi.string()
    .required()
    .label("description")
    .messages({
      "any.required": "The description of the category is required.",
      "string.base": "The description must be a string.",
    })
    .label("description"),
  type: Joi.string()
    .required()
    .messages({
      "any.required": "The type of the category is required.",
      "string.base": "The type must be a string.",
    })
    .label("Category type"),
});

export const categoryArraySchema = Joi.object({
  items: Joi.array()
    .items(categoryObjectSchema)
    .min(1)
    .max(20) // Ensure at least one object is present in the array
    .required()
    .messages({
      "array.base": "The input must be an array of objects.",
      "array.min": "At least one category object is required.",
      "array.max": "Maximum 20 category object is possible at once.",
      "any.required": "The array of categories is required.",
    }),
});

export const signupSendOtpSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .trim()
    .min(3)
    .max(50)
    .label("user firstName"),

  lastName: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .trim()
    .min(3)
    .max(50)
    .label("user lastName"),

  email: Joi.string().email().required().label("user email"),

  mobile: Joi.string()
    .pattern(/^\+\d{1,4}-\d{10}$/)
    .required()
    .label("user mobile number"),

  dob: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
    .label("dob"),
});

export const verifySignupOtpSchema = Joi.object({
  mobile: Joi.string()
    .pattern(/^\+\d{1,4}-\d{10}$/)
    .required()
    .label("user mobile number"),
  otp: Joi.string().length(6).required().label("otp"),
});

export const loginSendOtpSchema = Joi.object({
  identity: Joi.alternatives()
    .try(
      Joi.string()
        .pattern(/^\+\d{1,4}-\d{10}$/)
        .message("identity must be a 10-digit number"),
      Joi.string()
        .email({ tlds: { allow: false } })
        .message("identity must be a valid email address")
    )
    .required()
    .messages({
      "alternatives.any":
        "identity must be either a 10-digit number or a valid email address",
      "any.required": "Identity is required",
    }),
});

export const loginVerifyOtpSchema = Joi.object({
  identity: Joi.alternatives()
    .try(
      Joi.string()
        .pattern(/^\+\d{1,4}-\d{10}$/)
        .message("identity must be a 10-digit number"),
      Joi.string()
        .email({ tlds: { allow: false } })
        .message("identity must be a valid email address")
    )
    .required()
    .messages({
      "alternatives.any":
        "identity must be either a 10-digit number or a valid email address",
      "any.required": "Identity is required",
    }),
  otp: Joi.string().length(6).required().label("otp"),
});

const varientSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().allow("").required(), // Allow empty string but required
  images: Joi.array().items(Joi.string()).min(1).required(), // At least one image, must be a valid URL
  mrp: Joi.array().items(Joi.number().positive()).required(), // Array of positive numbers
  sizes: Joi.array().items(Joi.string()).required(), // Array of strings for sizes
});

// Define the main schema
export const masterProductSchema = Joi.object({
  categoryId: Joi.string().required(),
  brandName: Joi.string().required(),
  name: Joi.string().required(),
  varients: Joi.array().items(varientSchema).min(1).required(), // At least one variant required
});

const locationSchema = Joi.object({
  adressLine1: Joi.string().max(200).required(), // Address line 1 is required
  adressLine2: Joi.string().max(200).optional().allow(""), // Address line 2 is optional
  pinCode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Pin code must be a 6-digit number",
      "any.required": "Pin code is required",
    }), // Ensuring pin code is exactly 6 digits
  latitude: Joi.number().min(-90).max(90).label("latitude").required(), // Valid latitude range
  longitude: Joi.number().min(-180).max(180).required().label("longitude"), // Valid longitude range
});

export const sellerSchema = Joi.object({
  aadharNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .required()
    .messages({
      "string.pattern.base": "Aadhar number must be a 16-digit number",
      "any.required": "Aadhar number is required",
    }), // Ensuring Aadhar is exactly 16 digits

  gstNumber: Joi.string()
    .optional()
    .allow("")
    .pattern(/^[0-9A-Z]{15}$/)
    .messages({
      "string.pattern.base":
        "GST number must be 15 characters (alphanumeric, uppercase)",
    }), // GST number should be exactly 15 alphanumeric characters
  locations: Joi.array().items(locationSchema).min(1).required().messages({
    "array.min": "At least one location is required",
  }), // At least one location must be provided
});

export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Define Joi schema for `lots` array
const lotSchema = Joi.object({
  varientId: Joi.string().required().label("varientId").messages({
    "any.required": "Varient ID is required",
  }),
  quantity: Joi.number()
    .integer()
    .positive()
    .required()
    .label("quantity")
    .messages({
      "number.base": "Quantity must be a number",
      "number.positive": "Quantity must be greater than zero",
      "any.required": "Quantity is required",
    }),
  mfg: Joi.string()
    .pattern(dateRegex)
    .required()
    .label("manufacturing date")
    .messages({
      "string.pattern.base": "MFG date must be in YYYY-MM-DD format",
      "any.required": "MFG date is required",
    }),
  expiry: Joi.string().pattern(dateRegex).required().label("expiry").messages({
    "string.pattern.base": "Expiry date must be in YYYY-MM-DD format",
    "any.required": "Expiry date is required",
  }),
  price: Joi.number().positive().label("price").required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than zero",
    "any.required": "Price is required",
  }),
  discount: Joi.number().min(0).max(100).label("discount").required().messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount cannot be less than 0",
    "number.max": "Discount cannot be more than 100",
    "any.required": "Discount is required",
  }),
  size: Joi.string().label("size").required().messages({
    "any.required": "Size is required",
  }),
});

// Define Joi schema for the main object
export const sellerProductSchema = Joi.object({
  masterProductId: Joi.string().required().messages({
    "any.required": "Master Product ID is required",
  }),
  deliveryPins: Joi.array()
    .items(Joi.string().pattern(/^\d{6}$/))
    .messages({
      "string.pattern.base": "Each delivery pin must be a 6-digit number",
    }),
  lots: Joi.array().items(lotSchema).min(1).required().messages({
    "array.min": "At least one lot is required",
  }),
});
