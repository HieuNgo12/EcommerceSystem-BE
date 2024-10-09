import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const paymentModel = new mongoose.Schema(
  
  {
    status: {
      // Current status of payment
      type: String,
      enum: paymentStatusOptions,
      required: true,
    },
    actionType: {
      // Type of action
      type: String,
      required: true,
    },
    actionData: {
      // Data associated with action
      type: Object,
    },
    paymentId: {
      // Id from external payment references (in this case from Payment Id from Square)
      type: String,
      default: "",
    },
    created: { type: Date, default: Date.now, required: true },
    user: {
        _id: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
  },
  { autoCreate: true, autoIndex: true }
);

const PaymentModel = mongoose.model("payment", paymentModel);
export default PaymentModel;
