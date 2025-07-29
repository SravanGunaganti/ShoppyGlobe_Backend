// Importing utility function to send error responses and validate product fields
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import {
  isNumber,
  isPositiveInteger,
  isValidObject,
} from "../utils/validators.js";

// Middleware to validate bulk product creation requests
export function validateBulkProducts(req, res, next) {
  const products = req.body;
  // Check if products is an array and not empty
  if (!Array.isArray(products) || products.length === 0) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Products data",
      "Request body must be a non-empty array of product objects."
    );
  }
  // Validate each product in the array
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (!isValidObject(product)) {
      return sendErrorResponse(
        res,
        400,
        "Invalid Product Structure",
        `Product at index ${i} must be a valid JSON object, not null, array, or other type.`
      );
    }
    const { name, description, price, stock } = product;

    // Check if all required fields are present and valid
    if (!name || !description || price === undefined || stock === undefined) {
      return sendErrorResponse(
        res,
        400,
        "Missing Required Fields",
        `Name, description, price , stock are required at index ${i}`
      );
    }

    // Validate name type and length
    if (
      typeof name !== "string" ||
      name.trim() < 2 ||
      typeof description !== "string" ||
      description.trim().length < 20 ||
      !isNumber(price) ||
      !isPositiveInteger(stock)
    ) {
      return sendErrorResponse(
        res,
        400,
        "Invalid Product Fields",
        `Product at index ${i} has invalid fields. 'name' must be a string with at least 2 characters, 'description' must be a string with at least 20 characters, 'price' must be a number > 0, and 'stock' must be a number > 0.`
      );
    }
  }

  next();
}
