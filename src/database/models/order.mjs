import mongoose from "mongoose";

const orderModel = new mongoose.Schema({
  firstName: { type: String, required: true },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  apartment: { type: String },
  town: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String, required: true },
});

const OrderModel = mongoose.model("orders", orderModel);
export default OrderModel;
