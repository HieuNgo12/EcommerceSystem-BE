import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const couponModel = new mongoose.Schema(
  {
    couponCodeName: {
      type: String,
      min: 5,
      max: 15,
      trim: true,
      unique: true,
    },
    orderId: {
      type: String,
      ref: "orders",
    },
    discount: {
      type: Number,
      default: 35,
    },
    status: {
      type: String,
      enum: ["Used", "Available"],
      default: "Available",
    },
    expirationTime: {
      type: Date,
      default: () => new Date(+new Date() + 182 * 24 * 60 * 60 * 1000),
      required: true,
    },
  },
  { autoCreate: true, autoIndex: true, timestamps: true }
);

const CouponModel = mongoose.model("coupon", couponModel);
export default CouponModel;
