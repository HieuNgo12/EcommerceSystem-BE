import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const couponModel = new mongoose.Schema(
  {
    couponCodeName: {
      type: String,
      min: 5,
      max: 15,
      trim: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    discount: {
      type: String,
    },
    discountStatus: {
      type: Boolean,
    },

    originalPrice: {
      type: Number,
    },
    finalPrice: {
      type: Number,
    },
    createdAt: {
      type: String,
      default:
        moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
    },
    updatedAt: {
      type: String,
      default:
        moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
    },
    expirationTime: {
      type: String,
      required: true,
    },
  },
  { autoCreate: true, autoIndex: true }
);

const CouponModel = mongoose.model("coupon", couponModel);
export default CouponModel;
