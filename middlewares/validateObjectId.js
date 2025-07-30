import mongoose from "mongoose";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";

// Middleware to validate MongoDB ObjectId from route parameters

export const validateObjectId = (req, res, next) => {
  const { id, productId } = req.params;
  // Check if both id and productId are provided
  if (!id && !productId) {
    return sendErrorResponse(
      res,
      400,
      "Missing Parameters",
      "Product Id must be provided in the request parameters."
    );
  }

  const paramValue = productId || id;
  const paramName = productId ? "productId" : "Id";

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(paramValue)) {
    // Return an error response if the ObjectId is invalid
    return sendErrorResponse(
      res,
      400,
      `Invalid ${paramName}`,
      `The provided product ID '${paramValue}' is not a valid MongoDB ObjectId.`
    );
  }

  next();

  // Proceed to next middleware or controller
};
