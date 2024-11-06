import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    slug: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    brand: { type: String, default: "" },
    size: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    reviewId: [
      {
        type: String,
        ref: "review",
      },
    ],
    status: {
      type: String,
      enum: ["available", "out_of_stock", "discontinued", "pre_order"],
      default: "available",
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
