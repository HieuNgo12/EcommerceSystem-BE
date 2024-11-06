import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      ref: "products",
      required: true,
    },
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    reply: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      text: { type: String },
      statusReply: { type: Boolean, default: false },
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending","active", "block"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("review", reviewSchema);
export default ReviewModel;
