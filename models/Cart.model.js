import mongoose from "mongoose";

// Defining the schema for the Cart model
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required for the cart."],
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product ID is required in the cart item."],
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required."],
          min: [1, "Quantity must be at least 1."],
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer value.",
          },
        },
      },
    ],
  },
  { timestamps: true }
);

// Creating the Cart model using the defined schema
const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
