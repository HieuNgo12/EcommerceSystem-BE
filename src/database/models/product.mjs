import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String, isUnique: true },
  category: { type: String },
  image: { type: String },
  description: { type: String },
  price: { type: String },
  rating: { type: String },
  reviewId: { type: String, ref: "review" },
  count: { type: String },
  review: { type: String },
  originalPrice: { type: String },
});

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
