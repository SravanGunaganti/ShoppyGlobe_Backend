// Controller for handling product-related operations
import ProductModel from "../models/Product.model.js";
// Importing utility functions for sending responses
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Controller function to insert multiple products in bulk
export const insertBulkProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.insertMany(req.body);
    return sendSuccessResponse(
      res,
      201,
      products,
      `${products.length} products inserted successfully.`
    );
  } catch (error) {
    next(error);
  }
};

// Controller function to create a new product
export const createProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.create(req.body);
    return sendSuccessResponse(
      res,
      201,
      product,
      "Product Created Successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Controller function to retrieve all products with optional limit
export const getAllProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query?.limit) || 30;
    const products = await ProductModel.find()
      .limit(limit)
      .select("-__v")
      .lean();
    return sendSuccessResponse(res, 200, products);
  } catch (error) {
    next(error);
  }
};

// Controller function to retrieve a product by its ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id)
      .select("-__v")
      .lean();

    if (!product) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `No product found with ID: ${req.params.id}`
      );
    }
    return sendSuccessResponse(res, 200, product);
  } catch (error) {
    next(error);
  }
};

// Controller function to update a product by its ID
export const updateProduct = async (req, res, next) => {
  try {
    //
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `No product found with ID: ${req.params.id}`
      );
    }
    return sendSuccessResponse(
      res,
      200,
      updatedProduct,
      "Product Updated Successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Controller function to delete a product by its ID
export const deleteProduct = async (req, res, next) => {
  try {
    // Find and delete the product by its ID
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return sendErrorResponse(
        res,
        404,
        "Not Found",
        `No product found with ID: ${req.params.id}`
      );
    }
    return sendSuccessResponse(
      res,
      200,
      deletedProduct,
      "Product Deleted Successfully"
    );
  } catch (error) {
    next(error);
  }
};
