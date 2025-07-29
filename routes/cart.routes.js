// Import controller functions to handle cart operations
import {
  getCartByUser,
  deleteCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart.controller.js";


// Middleware to ensure that the productId in the request is a valid ObjectId
import { validateObjectId } from "../middlewares/validateObjectId.js";

// Middleware to verify JWT token for protected routes
import verifyToken from "../middlewares/verifyToken.js";

// Middleware to validate the request body for cart operations
import { validateCartItem } from "../middlewares/validateCartItem.js";

// Function to define cart-related routes
export function cartRoutes(app) {
  // POST route to add an item to the cart, requires token verification and validation of the
  app.post("/api/cart", verifyToken, validateCartItem,addCartItem);
  // GET route to retrieve the cart for the authenticated user, requires token verification
  app.get("/api/cart", verifyToken, getCartByUser);
  // PUT route to update an item in the cart, requires token verification and validation of the request body
  app.put("/api/cart", verifyToken,validateCartItem, updateCartItem);
  // DELETE route to remove a specific item from the cart, requires token verification and validation of the product ID
  app.delete(
    "/api/cart/:productId",
    verifyToken,
    validateObjectId,
    deleteCartItem
  );
  // DELETE route to clear the entire cart for the authenticated user, requires token verification
  app.delete("/api/cart", verifyToken, deleteCart);
}
