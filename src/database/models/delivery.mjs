import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const deliveryModel = new mongoose.Schema(
  {
 
  },
  { autoCreate: true, autoIndex: true }
);

const DeliveryModel = mongoose.model("delivery", deliveryModel);
export default DeliveryModel;
