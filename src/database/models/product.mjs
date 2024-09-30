import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  rating: { type: String, required: true },
});

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
