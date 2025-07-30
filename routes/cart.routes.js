// Import controller functions to handle cart operations
import {
  getCartByUser,
  addCartItem,
  deleteCartItem,
  deleteAllCartItems,
  increaseProductQuantity,
  decreaseProductQuantity,
} from "../controllers/cart.controller.js";


// Middleware to ensure that the productId in the request is a valid ObjectId
import { validateObjectId } from "../middlewares/validateObjectId.js";

// Middleware to verify JWT token for protected routes
import verifyToken from "../middlewares/verifyToken.js";

// Function to define cart-related routes
export function cartRoutes(app) {
  // POST route to add an item to the cart, requires token verification and validation of the
  app.post("/api/cart", verifyToken, validateObjectId("body","productId"),addCartItem);
  // GET route to retrieve the cart for the authenticated user, requires token verification
  app.get("/api/cart", verifyToken, getCartByUser);
  // PUT route to update an item in the cart, requires token verification and validation of the request body
  
  app.put("/api/cart/increment/:productId", verifyToken,validateObjectId("params","productId"), increaseProductQuantity);
  app.put("/api/cart/decrement/:productId", verifyToken,validateObjectId("params","productId"), decreaseProductQuantity);
  // DELETE route to remove a specific item from the cart, requires token verification and validation of the product ID
  app.delete(
    "/api/cart/:productId",
    verifyToken,
    validateObjectId("params", "productId"),
    deleteCartItem
  );
  // DELETE route to clear the entire cart for the authenticated user, requires token verification
  app.delete("/api/cart", verifyToken, deleteAllCartItems);
}
