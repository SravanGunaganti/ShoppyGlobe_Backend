import Cart from "../models/Cart.model.js";
import ProductModel from "../models/Product.model.js";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Adds a product to the user cart
export const addCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    const product = await ProductModel.findById(productId);
    // Check if the product exists
    if (!product) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `No product found with ID: ${productId} to add to cart`
      );
    }
    //
    if (!product.stock > 0) {
      return sendErrorResponse(
        res,
        400,
        "Stock Limit Exceeded",
        `Cannot add to cart, only ${product.stock} items in stock. `
      );
    }
    // Check if the user already has a cart
    let isNewCart = false;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      isNewCart = true;
      cart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      let newQuantity = 1;
      const index = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (index > -1) {
        newQuantity = cart.products[index].quantity + 1;
        if (newQuantity > product.stock) {
          return sendErrorResponse(
            res,
            400,
            "Stock Limit Exceeded",
            `Current quantity in cart: ${cart.products[index].quantity}, stock available: ${product.stock}.`
          );
        }
        cart.products[index].quantity = newQuantity;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    // Populate the cart with product details
    const populatedCart = await cart.populate("products.productId");
    return sendSuccessResponse(
      res,
      isNewCart ? 201 : 200,
      populatedCart,
      isNewCart
        ? "Cart created and product added successfully"
        : "Product added to cart successfully"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// GET /cart - Retrieve the user's cart
export const getCartByUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        `No cart found for user ID ${userId}`
      );
    }
    return sendSuccessResponse(res, 200, cart);
  } catch (err) {
    next(err);
  }
};

// Update the quantity of a product in the user's cart
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `No product found with ID ${productId} in cart`
      );
    }
    if (quantity > product.stock) {
      return sendErrorResponse(
        res,
        400,
        "Stock Limit Exceeded",
        `Current quantity in cart: ${quantity}, stock available: ${product.stock}.`
      );
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        `No cart found for user ID ${userId}`
      );
    }
    // Check if the product exists in the cart
    //
    const index = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    // If the product is not found in the cart, return an erro
    if (index === -1) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `No product found with ID '${productId}' in cart`
      );
    }
    // If the product is found, update its quantity

    cart.products[index].quantity = quantity;
    await cart.save();
    const populatedCart = await cart.populate("products.productId");
    return sendSuccessResponse(
      res,
      200,
      populatedCart,
      "Cart Updated SuccessFully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete a specific product from the user's cart
export const deleteCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        `No cart found for user ID ${userId}`
      );
    }

    const index = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `No product found with ID '${productId}' in cart`
      );
    }
    // If the product is found, remove it from the cart
    cart.products.splice(index, 1);
    if (cart.products.length === 0) {
      await cart.deleteOne();
      return sendSuccessResponse(
        res,
        200,
        [],
        "Cart is now empty and has been deleted."
      );
    }
    await cart.save();

    // Populate the cart with product details
    const populatedCart = await cart.populate("products.productId");
    return sendSuccessResponse(
      res,
      200,
      populatedCart,
      "Deleted Cart Item SuccessFully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete the entire cart for the user
export const deleteCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Find and delete the cart for the user

    const deleted = await Cart.findOneAndDelete({ userId });

    if (!deleted) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        `Cannot delete. No cart found for user ID ${userId}`
      );
    }
    // If the cart is deleted successfully, send a success response
    return sendSuccessResponse(
      res,
      200,
      [],
      `Cart for user ID ${userId} deleted successfully.`
    );
  } catch (err) {
    next(err);
  }
};
