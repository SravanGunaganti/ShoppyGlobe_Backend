// Import controller functions to handle user operations
import { loginUser, registerUser } from "../controllers/user.controller.js";

// Middleware to validate user registration and login requests
import {
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/userValidation.js";

// Function to define user-related routes
export function userRoutes(app) {
  // POST route for user registration, with validation middleware
  app.post("/api/register", validateRegisterUser, registerUser);

  // POST route for user login, with validation middleware
  app.post("/api/login", validateLoginUser, loginUser);
}
