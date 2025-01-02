import Category from "../../../models/Category.js";
import CommonModel from "../../model/commonmodel.js";
import { S3Client } from "@aws-sdk/client-s3";
import { uploadImageToS3 } from "../../utils/functions.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await CommonModel.find({pk:"CATEGORY#GENERAL"},{details:1,_id:1});
    const prefixlink = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
    const customeResponse = categories.map((obj)=>{
      return {_id:obj._id,...obj.details,images:prefixlink+obj.details.images}
    })
    res.status(200).json({
      status: "success",
      message: "Categories fetched successfully",
      data: customeResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching categories",
      error: error.message,
    });
  }
};


export const insertCategories = async (req,res)=>{
  try {
    
     if(!req.files||req.files.length!==req.body.items.length){
       throw {message:"Number of photos is not equal to "}
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
     const insertQuery = req.body.items.forEach((object,i)=>{
      const {name,type} = object
      if(uploadResults[i].value!==null){
        const categoryObject = {
          "pk": "CATEGORY#GENERAL",     // Primary key identifying the category
          "sk": `CATEGORY#${name}`,
           "sk1":`${type}`,
          "details": {
           ...object,
           images: uploadResults[i].value                      // Array of general images representing this category
          },
         
        }
        categoryToInsert.push(categoryObject)
      }
      
     })
    const response = await CommonModel.insertMany(categoryToInsert);
    const prefixlink = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
     const customeResponse = response.map((obj)=>{
      return {"_id":obj._id,
        details:{...obj.details,images:prefixlink+obj.details.images}
      }
     })
    res.status(201).json({
      status:"succcess",
      data:customeResponse
    })
  } catch (error) {
    res.status(500).json({
      status:"Fail",
      message:error.message
    })
  }
}



export const uploadImage = async (req, res) => {
  try {
   
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

    const data = uploadResults.map((obj)=>{
      if(obj.value){
        return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`+obj.value
      }
    })
    res.status(200).json({
      status:"success",
      message:"Images uploaded successfylly",
      data
    })
    
   

  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ error: error.message });
  }
};

