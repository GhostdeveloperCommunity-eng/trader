import Category from "../../../models/Category.js";
import CommonModel from "../../model/commonmodel.js";
import { S3Client } from "@aws-sdk/client-s3";
import { uploadImageToS3 } from "../../utils/functions.js";
import CategoryModel from "../../model/categoryModel.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    console.log({categories})
    const prefixlink = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const customeResponse = categories.map((obj) => {
      return {
        _id: obj._id,
        ...obj,
        images: prefixlink + obj.images,
      };
    });
    res.status(200).json({
      code: 1,
      message: "Categories fetched successfully",
      data: customeResponse,
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: Error`error fetching categories:${error.message}`,
      data: [],
    });
  }
};

export const insertCategories = async (req, res) => {
  try {
    if (!req.files || req.files.length !== req.body.items.length) {
      throw {
        message: "Number of photos is not equal to numbers of Category ",
      };
    }

    const categoryToInsert = [];
    const bucketName = process.env.BUCKET_NAME;
    const folderName = process.env.S3_FOLDER_NAME;

    // Use Promise.allSettled to handle all file uploads
    const uploadResults = await Promise.allSettled(
      req.files.map(async (file) => {
        const key = `${folderName}/${Date.now()}-${file.originalname}`;

        return await uploadImageToS3(
          bucketName,
          key,
          file.buffer,
          file.mimetype,
          "inline" // Ensures file is viewable but not downloadable
        );
      })
    );
    const insertQuery = req.body.items.forEach((object, i) => {
      if (uploadResults[i].value !== null) {
        const categoryObject = {
          ...object,
          images: uploadResults[i].value, // Array of general images representing this category
        };
        categoryToInsert.push(categoryObject);
      }
    });
    const response = await CategoryModel.insertMany(categoryToInsert);
    const prefixlink = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const customeResponse = response.map((obj) => {
      return {
        _id: obj._id,
        details: { ...obj, images: prefixlink + obj.images },
      };
    });
    res.status(200).json({
      code: 1,
      data: customeResponse,
      message: "Category inserted Successfully",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      data: null,
      message: `error while inserting Category:${error.message}`,
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (req.files.length == 0) throw { message: "please send image" };
    const bucketName = process.env.BUCKET_NAME;
    const folderName = process.env.S3_FOLDER_NAME;

    // Use Promise.allSettled to handle all file uploads
    const uploadResults = await Promise.allSettled(
      req.files.map(async (file) => {
        const key = `${folderName}/${Date.now()}-${file.originalname}`;

        return await uploadImageToS3(
          bucketName,
          key,
          file.buffer,
          file.mimetype,
          "inline" // Ensures file is viewable but not downloadable
        );
      })
    );

    const data = uploadResults.map((obj) => {
      if (obj.value) {
        return (
          `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` +
          obj.value
        );
      }
    });
    res.status(200).json({
      code: 1,
      message: "Images uploaded successfylly",
      data,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(200).json({
      data: [],
      code: 0,
      message: `error while uploading image ${error.message}`,
    });
  }
};
