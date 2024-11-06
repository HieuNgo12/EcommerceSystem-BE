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
    rating: {
      rate: { type: Number, default: 0 }, // Điểm trung bình đánh giá
      totalReviews: { type: Number, default: 0 }, // Tổng số lượng đánh giá
      stars: {
        // Chi tiết các đánh giá cho từng mức sao
        one: [
          {
            reviewId: { type: String, ref: "review" }, // Tham chiếu đến đối tượng review
            point: { type: Number, default: 0 }, // Điểm đánh giá cho mức 1 sao
          },
        ],
        two: [
          {
            reviewId: { type: String, ref: "review" }, // Tương tự cho 2 sao
            point: { type: Number, default: 0 },
          },
        ],
        three: [
          {
            reviewId: { type: String, ref: "review" }, // Tương tự cho 3 sao
            point: { type: Number, default: 0 },
          },
        ],
        four: [
          {
            reviewId: { type: String, ref: "review" }, // Tương tự cho 4 sao
            point: { type: Number, default: 0 },
          },
        ],
        five: [
          {
            reviewId: { type: String, ref: "review" }, // Tương tự cho 5 sao
            point: { type: Number, default: 0 },
          },
        ],
      },
    },
    status: {
      type: String,

      enum: ["available", "out_of_stock", "discontinued", "pre_order"], // Chỉ cho phép các giá trị này
      default: "available", // Giá trị mặc định là "available"
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
