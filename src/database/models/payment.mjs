import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const paymentModel = new mongoose.Schema(
  {
    status: {
      // Current status of payment
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Failed", "Successful"],
    },
    paymentCard: {
      type: String,
      required: true,
      default: "123456789",
    },
    paymentDue: {
      type: Date,
      required: true,
      default: () => new Date(+new Date() + 2 * 24 * 60 * 60 * 1000),
    },
    paymentId: {
      type: String,
      default: "",
    },
    user: {
      type: String,
      ref: "user",
    },
  },
  { autoCreate: true, autoIndex: true, timestamps: true }
);

const PaymentModel = mongoose.model("payment", paymentModel);
export default PaymentModel;
