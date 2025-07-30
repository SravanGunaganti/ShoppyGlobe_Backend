import mongoose from "mongoose";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { isValidObject } from "../utils/validators.js";

// Middleware to validate ObjectId in request parameters or body
export const validateObjectId = (source, field) => {
  return (req, res, next) => {
    const dataSource = req[source];

    // checks source type and ensures that the body is a valid JSON object
    if (source === "body") {
      if (!isValidObject(dataSource)) {
        return sendErrorResponse(
          res,
          400,
          "Invalid Request Body",
          "Request body must be a valid non-array JSON object."
        );
      }
    }

    // check the value of the field in the specified source
    const value = dataSource?.[field];
    const label =
      field === "productId" ? "Product ID" : field === "id" ? "ID" : field;

    // Check if the value is provided
    if (!value) {
      return sendErrorResponse(
        res,
        400,
        `Missing ${label}`,
        `The field '${label}' is required in request ${source}.`
      );
    }
    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return sendErrorResponse(
        res,
        400,
        `Invalid ${label}`,
        `The provided ${label} '${value}' is not a valid MongoDB ObjectId.`
      );
    }

    next();
  };
};
