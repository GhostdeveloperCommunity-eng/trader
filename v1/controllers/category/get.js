import Category from "../../../models/Category.js";
import CommonModel from "../../model/commonmodel.js";
export const getCategories = async (req, res) => {
  try {
    const categories = await CommonModel.find({pk:"CATEGORY#GENERAL"});
    res.status(200).json({
      status: "success",
      message: "Categories fetched successfully",
      data: categories,
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
     const insertQuery = req.body.items.map((object)=>{
      const {name,type} = object
      const categoryObject = {
        "pk": "CATEGORY#GENERAL",     // Primary key identifying the category
        "sk": `CATEGORY#${name}`,
         "sk1":`${type}`,
        "details": {
         ...object                       // Array of general images representing this category
        },
       
      }
      return categoryObject
      
     })
    const response = await CommonModel.insertMany(insertQuery);
    res.status(201).json({
      status:"succcess",
      data:response
    })
  } catch (error) {
    res.status(500).json({
      status:"Fail",
      message:error.message
    })
  }
}
