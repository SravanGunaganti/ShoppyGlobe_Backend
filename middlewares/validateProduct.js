import { sendErrorResponse } from "../utils/sendErrorResponse.js";

// Importing utility functions to validate product fields
import { isNumber, isPositiveInteger } from "../utils/validators.js";

// Middleware to validate product creation and update requests
export const validateProduct = (req, res, next) => {
  const { name, description, price, stock } = req.body;

  // Check if all required fields are present and valid
  if (!name || !description || price == undefined || stock === undefined) {
    return sendErrorResponse(
      res,
      400,
      "Missing Required Fields",
      "Name, description, price , stock are required to add product"
    );
  }

  // Validate name type and length
  if (typeof name !== "string" || name.trim().length < 2) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Product Name",
      "Name is required and must be at least 2 characters."
    );
  }

  // Validate description type and length
  if (typeof description !== "string" || description.trim().length < 20) {
    return sendErrorResponse(
      res,
      400,
      "Invalid product Description",
      "Description is required and must be at least 20 characters."
    );
  }
  // Validate price and stock
  if (!isNumber(price)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Price Input",
      "Price is required and must be a positive number."
    );
  }

  if (!isPositiveInteger(stock)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Stock Input",
      "stock is required and must be a positive number."
    );
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
};
