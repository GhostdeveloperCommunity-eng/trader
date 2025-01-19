import Joi from "joi";

const categoryObjectSchema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z]+( [a-zA-Z]+)?$/, 'valid name')
      .required()
      .messages({
        'any.required': 'The name of the category is required.',
        'string.pattern.base': 'The name can only contain alphabets and a single space between words.',
        'string.base': 'The name must be a string.',
      }).label("name"),
    description: Joi.string()
      .required().label("description")
      .messages({
        'any.required': 'The description of the category is required.',
        'string.base': 'The description must be a string.',
      }).label("description"),
    type: Joi.string()
      .required()
      .messages({
        'any.required': 'The type of the category is required.',
        'string.base': 'The type must be a string.',
      }).label("Category type"),
  });

  export const categoryArraySchema =  Joi.object({
        items:Joi.array()
        .items(categoryObjectSchema)
        .min(1)
        .max(20) // Ensure at least one object is present in the array
        .required()
        .messages({
          'array.base': 'The input must be an array of objects.',
          'array.min': 'At least one category object is required.',
          'array.max': 'Maximum 20 category object is possible at once.',
          'any.required': 'The array of categories is required.',
        })
  })


export const   signupSendOtpSchema = Joi.object({
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

  email: Joi.string()
    .email()
    .required()
    .label("user email"),

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
    otp:Joi.string().length(6).required().label("otp")
})


export const loginSendOtpSchema = Joi.object({
  identity: Joi.alternatives().try(
      Joi.string()
          .pattern(/^\+\d{1,4}-\d{10}$/)
          .message('identity must be a 10-digit number'),
      Joi.string()
          .email({ tlds: { allow: false } })
          .message('identity must be a valid email address')
  ).required().messages({
      'alternatives.any': 'identity must be either a 10-digit number or a valid email address',
      'any.required': 'Identity is required'
  })
})

export const loginVerifyOtpSchema = Joi.object({
  identity: Joi.alternatives().try(
      Joi.string()
          .pattern(/^\+\d{1,4}-\d{10}$/)
          .message('identity must be a 10-digit number'),
      Joi.string()
          .email({ tlds: { allow: false } })
          .message('identity must be a valid email address')
  ).required().messages({
      'alternatives.any': 'identity must be either a 10-digit number or a valid email address',
      'any.required': 'Identity is required'
  }),
  otp:Joi.string().length(6).required().label("otp")
})




