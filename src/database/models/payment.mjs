import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const paymentModel = new mongoose.Schema(
  {
    status: {
      // Current status of payment
      type: String,
      required: true,
      default: "Failed",
      enum: ["Pending","Failed", "Successful"]
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
  { autoCreate: true, autoIndex: true }
);

const PaymentModel = mongoose.model("payment", paymentModel);
export default PaymentModel;
