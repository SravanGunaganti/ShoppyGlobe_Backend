import mongoose from "mongoose";

// Importing utility functions for validation
import { isPositiveInteger, isValidObject } from "../utils/validators.js";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";

// Middleware to validate cart item requests
export function validateCartItem(req, res, next) {
  if (!isValidObject(req.body)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Request Body",
      "Request body must be a plain JSON object."
    );
  }

  const { productId, quantity } = req.body;

  // Check if productId is provided
  if (!productId) {
    return sendErrorResponse(
      res,
      400,
      "Missing Product ID",
      "Product ID must be provided in the request body."
    );
  }
  // Validate productId format

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Product ID",
      `The provided product ID '${productId}' is not a valid MongoDB ObjectId.`
    );
  }
  const isUpdatingCart = req.method === "PUT";
  if (isUpdatingCart) {
    // If updating the cart, check if quantity is provided
    if (quantity === undefined || quantity === null) {
      return sendErrorResponse(
        res,
        400,
        "Missing Quantity",
        "Quantity must be provided for updating items in the cart."
      );
    }

    // Validate quantity if it's provided
    if (!isPositiveInteger(quantity)) {
      return sendErrorResponse(
        res,
        400,
        "Invalid Quantity",
        "Quantity must be a positive integer (minimum 1)."
      );
    }
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
}
