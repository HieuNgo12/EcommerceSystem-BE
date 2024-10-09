import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String },
  category: { type: String },
  image: { type: String },
  description: { type: String },
  price: { type: String },
  rating: { type: String },
  reviewId : {type: String, ref: 'review'},
  count: {type: String}
});

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
