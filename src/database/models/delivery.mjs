import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const deliveryModel = new mongoose.Schema(
  {
    userId: {
      type: String,

      ref: "user",
    },
    itemId: {
      type: String,

      ref: "products",
    },
    orderId: {
      type: String,

      ref: "products",
    },
    deliveryDate: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
    orderPlacedDate: {
      type: Date,

      default: () => Date.now(),
    },
    orderReceivedDate: {
      type: Date,

      default: () => new Date(+new Date() + 2 * 24 * 60 * 60 * 1000),
    },
  },
  { autoCreate: true, autoIndex: true }
);

const DeliveryModel = mongoose.model("delivery", deliveryModel);
export default DeliveryModel;
