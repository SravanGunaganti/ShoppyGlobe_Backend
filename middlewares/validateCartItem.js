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

  const { productId, quantity=1 } = req.body;
  // Check if productId and quantity are provided and valid
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Product ID",
      "A valid productId must be provided."
    );
  }

  if (!isPositiveInteger(quantity)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Quantity",
      "Quantity must be a positive integer (minimum 1)."
    );
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
}
