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
    images: Joi.string()
      .required()
      .messages({
        'any.required': 'The image link for the category is required.',
        'string.uri': 'The image link must be a valid URI.',
        'string.base': 'The image link must be a string.',
      }).label("Image URL"),
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
  