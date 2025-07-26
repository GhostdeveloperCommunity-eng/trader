import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import CommonModel from "../model/commonmodel.js";
import jwt from "jsonwebtoken";

const validateSchema = async (schema, object) => {
  try {
    const options = {
      abortEarly: true, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: false, // remove unknown props
    };
    const validate = await schema.validateAsync(object, options);
    return validate;
  } catch (error) {
    console.log(error, error.message);
    let message = error.message;
    message = message.replace(/"/g, "");
    throw { message };
  }
};

export const hofSchemaValidation = (schema) => {
  return async (req, res, next) => {
    try {
      const object = req.body;
      const validateBody = await validateSchema(schema, object);
      req.body = validateBody;
      next();
    } catch (error) {
      res.status(200).json({
        code: 0,
        data: null,
        message: error.message,
      });
    }
  };
};

export const s3Client = () =>
  new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

export const putObjectCommand = (params) => new PutObjectCommand(params);

export const uploadImageToS3 = async (
  Bucket,
  Key,
  Body,
  ContentType,
  ContentDisposition
) => {
  try {
    const params = {
      Bucket,
      Key,
      Body,
      ContentType,
      ContentDisposition: ContentDisposition, // Important inline   for viewing but not downloading
    };
    console.log(params);
    const command = putObjectCommand(params);
    const uploaded = await s3Client().send(command);
    return Key;
  } catch (error) {
    console.log(error.message, "TTTTTTTTTTTTTTTT", error);
    return error;
  }
};

export const parseFormData = (...args) => {
  return async (req, res, next) => {
    try {
      // Loop through the properties using 'for...of'
      for (const property of args) {
        try {
          const value =
            typeof req.body[property] == "string"
              ? JSON.parse(req.body[property])
              : req.body[property];
          req.body[property] = value; // Update the req.body[property]
        } catch (error) {
          throw {
            message: `${property} is not a valid JSON string`,
          };
        }
      }
      next(); // Move to the next middleware after processing all properties
    } catch (error) {
      res.status(200).json({
        code: 0,
        data: null,
        message: error.message,
      });
    }
  };
};

export const generateOtp = () => {
  let a = Math.random() * 1000000;
  a = Math.floor(a);
  a = a + "";
  if (a.length < 6) {
    a = a.padStart(6, "0");
  }

  return a;
};

export const jwtSignIn = (obj) => {
  const token = jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  return token;
};

export const authorizer = async (req, res, next) => {
  try {
    let token;
    console.log("RRRRRRRRRR", req.headers, req.headers.authorization);
    let a = "fff";
    a.startsWith;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw {
        message: "please send token in headers",
      };
    }
    const value = jwt.verify(token, process.env.JWT_SECRET);
    if (!value) {
      throw {
        message: "please login again",
      };
    }

    const { _id } = jwt.decode(token);
    const user = await CommonModel.findById(_id);
    if (!user) {
      throw {
        message: "user not found",
      };
    }
    req._user = user;
    next();
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: error.message || "SOMETHING WENT WRONG",
      data: null,
    });
  }
};
