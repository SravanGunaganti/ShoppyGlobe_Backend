import mongoose from "mongoose";

// Defining the schema for the Product model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required."],
    trim: true,
    minlength: [2, "Product name must be at least 2 characters long."],
  },
  description: {
    type: String,
    required: [true, "Product description is required."],
    trim: true,
    minlength: [20, "Description must be at least 20 characters long."],
  },
  price: {
    type: Number,
    required: [true, "Product price is required."],
    min: [0.01, "Price must be greater than 0."],
    validate: {
      validator: function (v) {
        return typeof v === "number" && !isNaN(v);
      },
      message: "Price must be a valid number.",
    },
  },
  stock: {
    type: Number,
    required: [true, "Stock is required."],
    min: [1, "Stock must be at least 1."],
    validate: {
      validator: Number.isInteger,
      message: "Stock must be an integer.",
    },
  },
});

// Creating the Product model using the defined schema
const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
