import Category from "../../../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
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
