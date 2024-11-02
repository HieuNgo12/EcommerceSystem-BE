import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      ref: "products",
    },
    userId: {
      type: String,
      ref: "user",
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("review", reviewSchema);
export default ReviewModel;
